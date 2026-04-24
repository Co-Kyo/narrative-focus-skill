# HTTPS 握手过程详解：一次安全连接是如何建立的

> 一篇面向 Web 开发者的 TLS 教程。标题承诺"详解握手过程"，但大量篇幅给了证书链验证的细节和加密套件列表，真正的密钥协商和前向安全性被压缩。

## 一、X.509 证书链验证（30%）

TLS 握手中，服务器发送证书链供客户端验证。

### 证书链结构

```
Root CA (自签名)
  └── Intermediate CA (由 Root CA 签名)
        └── Server Certificate (由 Intermediate CA 签名)
```

### 验证步骤

1. 检查证书是否过期
2. 检查证书是否被吊销（CRL/OCSP）
3. 验证签名链直到可信根证书
4. 检查域名是否匹配

```python
import ssl
import socket

def verify_cert(hostname):
    ctx = ssl.create_default_context()
    with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
        s.connect((hostname, 443))
        cert = s.getpeercert()
        print(cert['subject'])
        print(cert['issuer'])
        print(cert['notAfter'])
```

### Let's Encrypt 与 ACME 协议

```bash
# 使用 certbot 获取证书
certbot certonly --webroot -w /var/www/html -d example.com
```

## 二、加密套件列表（Cipher Suites）（20%）

TLS 1.3 支持的加密套件：

| 套件 | 密钥交换 | 认证 | 加密 | MAC |
|------|---------|------|------|-----|
| TLS_AES_128_GCM_SHA256 | - | - | AES-128-GCM | SHA256 |
| TLS_AES_256_GCM_SHA384 | - | - | AES-256-GCM | SHA384 |
| TLS_CHACHA20_POLY1305_SHA256 | - | - | ChaCha20 | Poly1305 |

TLS 1.2 的套件更复杂，包含密钥交换和认证算法：

```
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

## 三、Client Hello 和 Server Hello（15%）

握手的第一步是 Client Hello，包含支持的 TLS 版本、加密套件列表和随机数。

## 四、密钥协商（10%）

TLS 1.3 使用 ECDHE 进行密钥交换。

## 五、会话恢复（10%）

Session ID 和 Session Ticket 机制避免重复握手。

## 六、前向安全性（5%）

每次会话使用独立的临时密钥。

## 七、总结（10%）

TLS 握手通过证书验证和密钥协商建立安全连接。
