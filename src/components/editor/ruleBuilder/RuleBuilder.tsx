"use client"

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "../../ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Input } from "../../ui/Input"
import type { Rule, RuleGroup, RuleCondition, RuleOperator, ComparisonOperator, OperatorOption } from "../../../types/ruleBuilder.types"
import { toSpel, createEmptyCondition, createEmptyGroup } from "../../../utils/ruleBuilderUtils"

interface RuleBuilderProps {
  value: Rule
  onChange: (rule: Rule) => void
  onSpelChange: (spel: string) => void
}

const operatorOptions: OperatorOption[] = [
  { value: 'equals', label: 'Equals', symbol: '==' },
  { value: 'notEquals', label: 'Not Equals', symbol: '!=' },
  { value: 'greaterThan', label: 'Greater Than', symbol: '>' },
  { value: 'greaterThanOrEqual', label: 'Greater or Equal', symbol: '>=' },
  { value: 'lessThan', label: 'Less Than', symbol: '<' },
  { value: 'lessThanOrEqual', label: 'Less or Equal', symbol: '<=' },
  { value: 'contains', label: 'Contains', symbol: 'contains' },
  { value: 'notContains', label: 'Not Contains', symbol: '!contains' },
  { value: 'startsWith', label: 'Starts With', symbol: 'startsWith' },
  { value: 'endsWith', label: 'Ends With', symbol: 'endsWith' },
]

export function RuleBuilder({ value, onChange, onSpelChange }: RuleBuilderProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (path: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const updateRule = (path: number[], newRule: Rule) => {
    const updateRecursive = (rule: Rule, currentPath: number[]): Rule => {
      if (currentPath.length === 0) {
        return newRule
      }
      
      if (rule.type === 'group') {
        const [index, ...rest] = currentPath
        return {
          ...rule,
          children: rule.children.map((child: Rule, i: number) => 
            i === index ? updateRecursive(child, rest) : child
          )
        }
      }
      
      return rule
    }
    
    const updated = updateRecursive(value, path)
    onChange(updated)
    onSpelChange(toSpel(updated))
  }

  const addCondition = (path: number[]) => {
    const addRecursive = (rule: Rule, currentPath: number[]): Rule => {
      if (currentPath.length === 0) {
        if (rule.type === 'group') {
          return {
            ...rule,
            children: [...rule.children, createEmptyCondition()]
          }
        }
        return rule
      }
      
      if (rule.type === 'group') {
        const [index, ...rest] = currentPath
        return {
          ...rule,
          children: rule.children.map((child: Rule, i: number) => 
            i === index ? addRecursive(child, rest) : child
          )
        }
      }
      
      return rule
    }
    
    const updated = addRecursive(value, path)
    onChange(updated)
    onSpelChange(toSpel(updated))
  }

  const addGroup = (path: number[]) => {
    const addRecursive = (rule: Rule, currentPath: number[]): Rule => {
      if (currentPath.length === 0) {
        if (rule.type === 'group') {
          return {
            ...rule,
            children: [...rule.children, createEmptyGroup()]
          }
        }
        return rule
      }
      
      if (rule.type === 'group') {
        const [index, ...rest] = currentPath
        return {
          ...rule,
          children: rule.children.map((child: Rule, i: number) => 
            i === index ? addRecursive(child, rest) : child
          )
        }
      }
      
      return rule
    }
    
    const updated = addRecursive(value, path)
    onChange(updated)
    onSpelChange(toSpel(updated))
  }

  const removeItem = (path: number[]) => {
    const removeRecursive = (rule: Rule, currentPath: number[]): Rule => {
      if (currentPath.length === 0) {
        return rule
      }
      
      if (rule.type === 'group') {
        const [index, ...rest] = currentPath
        if (rest.length === 0) {
          return {
            ...rule,
            children: rule.children.filter((_, i) => i !== index)
          }
        }
        return {
          ...rule,
          children: rule.children.map((child: Rule, i: number) => 
            i === index ? removeRecursive(child, rest) : child
          )
        }
      }
      
      return rule
    }
    
    const updated = removeRecursive(value, path)
    onChange(updated)
    onSpelChange(toSpel(updated))
  }

  const updateGroupOperator = (path: number[], operator: RuleOperator) => {
    const updateRecursive = (rule: Rule, currentPath: number[]): Rule => {
      if (currentPath.length === 0) {
        if (rule.type === 'group') {
          return { ...rule, operator }
        }
        return rule
      }
      
      if (rule.type === 'group') {
        const [index, ...rest] = currentPath
        return {
          ...rule,
          children: rule.children.map((child: Rule, i: number) => 
            i === index ? updateRecursive(child, rest) : child
          )
        }
      }
      
      return rule
    }
    
    const updated = updateRecursive(value, path)
    onChange(updated)
    onSpelChange(toSpel(updated))
  }

  return (
    <div className="space-y-2">
      <RuleItem
        rule={value}
        path={[]}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
        onUpdate={updateRule}
        onAddCondition={addCondition}
        onAddGroup={addGroup}
        onRemove={removeItem}
        onUpdateGroupOperator={updateGroupOperator}
      />
    </div>
  )
}

interface RuleItemProps {
  rule: Rule
  path: number[]
  expandedGroups: Set<string>
  onToggleGroup: (path: string) => void
  onUpdate: (path: number[], rule: Rule) => void
  onAddCondition: (path: number[]) => void
  onAddGroup: (path: number[]) => void
  onRemove: (path: number[]) => void
  onUpdateGroupOperator: (path: number[], operator: RuleOperator) => void
}

function RuleItem({
  rule,
  path,
  expandedGroups,
  onToggleGroup,
  onUpdate,
  onAddCondition,
  onAddGroup,
  onRemove,
  onUpdateGroupOperator
}: RuleItemProps) {
  const pathKey = path.join('-')
  const isExpanded = expandedGroups.has(pathKey)

  if (rule.type === 'condition') {
    return (
      <ConditionRow
        condition={rule}
        path={path}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    )
  }

  return (
    <div className="border-l-2 border-primary/30 pl-3 space-y-2" style={{ marginLeft: path.length * 20 }}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onToggleGroup(pathKey)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        
        <span className="text-xs font-semibold text-primary">
          {rule.operator}
        </span>

        <div className="flex-1" />

        <Select
          value={rule.operator}
          onValueChange={(value: RuleOperator) => onUpdateGroupOperator(path, value)}
        >
          <SelectTrigger className="h-6 w-auto text-xs border-primary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>

        {path.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={() => onRemove(path)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {rule.children.map((child: Rule, index: number) => (
            <RuleItem
              key={`${pathKey}-${index}`}
              rule={child}
              path={[...path, index]}
              expandedGroups={expandedGroups}
              onToggleGroup={onToggleGroup}
              onUpdate={onUpdate}
              onAddCondition={onAddCondition}
              onAddGroup={onAddGroup}
              onRemove={onRemove}
              onUpdateGroupOperator={onUpdateGroupOperator}
            />
          ))}
          
          <div className="flex gap-2 pt-2 pl-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onAddCondition(path)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Condition
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onAddGroup(path)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Group
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface ConditionRowProps {
  condition: RuleCondition
  path: number[]
  onUpdate: (path: number[], rule: Rule) => void
  onRemove: (path: number[]) => void
}

function ConditionRow({ condition, path, onUpdate, onRemove }: ConditionRowProps) {
  const selectedOperator = operatorOptions.find(o => o.value === condition.operator)

  return (
    <div className="flex items-center gap-1 p-2 bg-muted/50 rounded">
      <Input
        type="text"
        value={condition.field}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(path, { ...condition, field: e.target.value })}
        placeholder="Key"
        className="h-7 min-w-16 flex-1 text-xs"
      />

      <Select
        value={condition.operator}
        onValueChange={(value: ComparisonOperator) => onUpdate(path, { ...condition, operator: value })}
      >
        <SelectTrigger className="h-7 min-w-20 flex-1 text-xs">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operatorOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={String(condition.value)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(path, { ...condition, value: e.target.value })}
        placeholder="Value"
        className="h-7 min-w-16 flex-1 text-xs"
      />

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-destructive flex-shrink-0"
        onClick={() => onRemove(path)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
