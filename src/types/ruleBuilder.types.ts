export type RuleOperator = 'AND' | 'OR';

export type ComparisonOperator = 
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith';

export interface RuleCondition {
  type: 'condition';
  field: string;
  operator: ComparisonOperator;
  value: string | number | boolean;
}

export interface RuleGroup {
  type: 'group';
  operator: RuleOperator;
  children: (RuleGroup | RuleCondition)[];
}

export type Rule = RuleGroup | RuleCondition;

export interface OperatorOption {
  value: ComparisonOperator;
  label: string;
  symbol: string;
}
