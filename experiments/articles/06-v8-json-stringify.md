# How we made JSON.stringify more than twice as fast

> 来源：V8 官方博客 (v8.dev)
> 发布时间：2025-08-04
> URL：https://v8.dev/blog/json-stringify

---

JSON.stringify is a core JavaScript function for serializing data. Its performance directly affects common operations across the web, from serializing data for a network request to saving data to localStorage. A faster JSON.stringify translates to quicker page interactions and more responsive applications.

## A Side-Effect-Free Fast Path

The foundation of this optimization is a new fast path built on a simple premise: if we can guarantee that serializing an object will not trigger any side effects, we can use a much faster, specialized implementation.

As long as V8 can determine that serialization will be free from these effects, it can stay on this highly-optimized path. This allows it to bypass many expensive checks and defensive logic required by the general-purpose serializer, resulting in a significant speedup for the most common types of JavaScript objects that represent plain data.

Furthermore, the new fast path is iterative, in contrast to the recursive general-purpose serializer. This architectural choice not only eliminates the need for stack overflow checks, but also allows developers to serialize significantly deeper nested object graphs than was previously possible.

## Handling different String Representations

Strings in V8 can be represented with either one-byte or two-byte characters. To avoid the constant branching and type checks of a unified implementation, the entire stringifier is now templatized on the character type. This means we compile two distinct, specialized versions of the serializer: one completely optimized for one-byte strings and another for two-byte strings.

The implementation handles mixed encodings efficiently. During serialization, we must already inspect each string's instance type to detect representations we can't handle on the fast path (like ConsString, which might trigger a GC during flattening) that require a fallback to the slow path.

## Optimizing String Serialization with SIMD

Any string in JavaScript can contain characters that require escaping when serializing to JSON. A traditional character-by-character loop to find them is slow.

To accelerate this, we employ a two-level strategy based on the string's length:
- For longer strings, we switch to dedicated hardware SIMD instructions (e.g., ARM64 Neon). This allows us to load a much larger chunk of the string into a wide SIMD register and check multiple bytes for any escapable characters at once.
- For shorter strings, we use a technique called SWAR (SIMD Within A Register). This approach uses clever bitwise logic on standard general-purpose registers to process multiple characters at once with very low overhead.

## The Express Lane on the Fast Path

Even within the main fast path, we found an opportunity for another, even faster 'express lane'. We introduce a flag on an object's hidden class. Once we have serialized all properties of an object, we mark its hidden class as `fast-json-iterable` if no property key is a Symbol, all properties are enumerable, and no property key contains characters that require escaping.

When we serialize an object that has the same hidden class as an object we serialized before and it is `fast-json-iterable`, we can simply copy all the keys to the string buffer without any further checks.

## A faster double-to-string algorithm

We identified an opportunity to significantly speed up number-to-string conversion by upgrading our core DoubleToString algorithm. We have now replaced the long-serving Grisu3 algorithm with Dragonbox for shortest length number to string conversions.

## Optimizing the underlying temporary buffer

Previously, our stringifier built the output in a single, contiguous buffer on the C++ heap. Whenever the buffer ran out of space, we had to allocate a larger one and copy the entire existing content over.

With this in mind, we replaced the old system with a segmented buffer. Instead of one large, growing block of memory, we now use a list of smaller buffers (or "segments"), allocated in V8's Zone memory. When a segment is full, we simply allocate a new one and continue writing there, completely eliminating the expensive copy operations.

## Limitations

The new fast path achieves its speed by specializing for common, simple cases:
- No replacer or space arguments
- Plain data objects and arrays
- No indexed properties on objects
