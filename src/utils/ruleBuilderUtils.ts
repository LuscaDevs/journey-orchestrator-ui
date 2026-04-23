import type { Rule, RuleGroup, RuleCondition, ComparisonOperator } from '../types/ruleBuilder.types';

const operatorToSpel: Record<ComparisonOperator, string> = {
  equals: '==',
  notEquals: '!=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  lessThan: '<',
  lessThanOrEqual: '<=',
  contains: 'contains',
  notContains: '!contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
};

const stringOperators: Set<ComparisonOperator> = new Set([
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
]);

export function toSpel(rule: Rule, isRoot: boolean = true): string {
  if (rule.type === 'condition') {
    return conditionToSpel(rule);
  } else {
    return groupToSpel(rule, isRoot);
  }
}

function conditionToSpel(condition: RuleCondition): string {
  const { field, operator, value } = condition;
  const spelOperator = operatorToSpel[operator];
  
  // Format value: don't quote numbers or booleans
  const formattedValue = formatValue(value);
  
  // Always use #eventData.${key}
  const spelField = field.startsWith('#') ? field : `#eventData.${field}`;
  
  // Handle contains/notContains/startsWith/endsWith
  if (operator === 'contains') {
    return `${spelField}.contains(${formattedValue})`;
  } else if (operator === 'notContains') {
    return `!${spelField}.contains(${formattedValue})`;
  } else if (operator === 'startsWith') {
    return `${spelField}.startsWith(${formattedValue})`;
  } else if (operator === 'endsWith') {
    return `${spelField}.endsWith(${formattedValue})`;
  }
  
  return `${spelField} ${spelOperator} ${formattedValue}`;
}

function formatValue(value: string | number | boolean): string {
  const valueStr = String(value);
  
  // Handle boolean values
  if (valueStr === 'true' || valueStr === 'false') {
    return valueStr;
  }
  
  // Handle numeric values
  if (!isNaN(Number(valueStr)) && valueStr.trim() !== '') {
    return valueStr;
  }
  
  // Default to quoted string
  return `'${valueStr}'`;
}

function groupToSpel(group: RuleGroup, isRoot: boolean = false): string {
  const { operator, children } = group;
  
  if (children.length === 0) {
    return 'true';
  }
  
  const spelOperator = operator === 'AND' ? '&&' : '||';
  const childExpressions = children.map(child => toSpel(child, false));
  
  // Always wrap in parentheses for nested groups, only root can be unwrapped
  const result = `(${childExpressions.join(` ${spelOperator} `)})`;
  
  // If root has only 1 child, unwrap to avoid double parentheses
  if (isRoot && children.length === 1) {
    return childExpressions[0];
  }
  
  return result;
}

export function createEmptyCondition(): RuleCondition {
  return {
    type: 'condition',
    field: '',
    operator: 'equals',
    value: '',
  };
}

export function createEmptyGroup(): RuleGroup {
  return {
    type: 'group',
    operator: 'AND',
    children: [createEmptyCondition()],
  };
}

// Basic SpEL parser - converts simple SpEL expressions to rule tree
// Note: This is a simplified parser that handles basic AND/OR expressions
export function parseSpelToRuleTree(spel: string): Rule {
  const trimmed = spel.trim();
  
  if (!trimmed) {
    return createEmptyGroup();
  }
  
  // Remove outer parentheses if present
  let cleaned = trimmed;
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  
  // Try to split by || (OR) first, respecting parentheses
  const orParts = splitByOperator(cleaned, '||');
  
  if (orParts.length > 1) {
    return {
      type: 'group',
      operator: 'OR',
      children: orParts.map(part => parseSpelToRuleTree(part))
    };
  }
  
  // Try to split by && (AND)
  const andParts = splitByOperator(cleaned, '&&');
  
  if (andParts.length > 1) {
    return {
      type: 'group',
      operator: 'AND',
      children: andParts.map(part => parseSpelToRuleTree(part))
    };
  }
  
  // Single condition - wrap in AND group so user can add more conditions
  const condition = parseCondition(cleaned);
  return {
    type: 'group',
    operator: 'AND',
    children: [condition]
  };
}

function splitByOperator(expression: string, operator: string): string[] {
  const parts: string[] = [];
  let current = '';
  let parenDepth = 0;
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth--;
      current += char;
    } else if (parenDepth === 0 && expression.slice(i, i + operator.length) === operator) {
      parts.push(current.trim());
      current = '';
      i += operator.length - 1;
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    parts.push(current.trim());
  }
  
  return parts;
}

function parseCondition(expression: string): RuleCondition {
  // Remove #eventData. prefix if present
  const cleaned = expression.replace(/^#eventData\./, '');
  
  // Parse operator and value
  const operators = ['>=', '<=', '==', '!=', '>', '<'];
  let operator = 'equals';
  let field = cleaned;
  let value = '';
  
  for (const op of operators) {
    const index = cleaned.indexOf(op);
    if (index !== -1) {
      operator = op;
      field = cleaned.slice(0, index).trim();
      value = cleaned.slice(index + op.length).trim();
      break;
    }
  }
  
  // Map SpEL operator to our operator
  const operatorMap: Record<string, ComparisonOperator> = {
    '==': 'equals',
    '!=': 'notEquals',
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqual',
    '<': 'lessThan',
    '<=': 'lessThanOrEqual',
  };
  
  // Remove quotes from value if present
  if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1);
  }
  
  return {
    type: 'condition',
    field,
    operator: operatorMap[operator] || 'equals',
    value,
  };
}
