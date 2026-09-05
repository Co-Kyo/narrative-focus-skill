import { createSkill } from 'skillnomad';
import { narrativeFocus } from './steps/narrative-focus.js';
import { contracts } from './contracts.js';

export const skill = createSkill({
  name: 'narrative-focus',
  title: '叙述重心规范',
  description: '检测并修正技术文章的叙述权重错位；收集阶段按角色标注防错位',
  steps: [narrativeFocus],
  contracts,
});
