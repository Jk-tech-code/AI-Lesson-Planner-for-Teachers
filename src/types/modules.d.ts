declare module "@prisma/adapter-pg" {
  import { Pool } from "pg"
  export class PrismaPg {
    constructor(pool: Pool)
  }
}

declare module "pg" {
  export class Pool {
    constructor(config: { connectionString: string })
    connect(): Promise<any>
    query(text: string, params?: any[]): Promise<any>
    end(): Promise<void>
  }
}

declare module "cmdk" {
  import { FC, ReactNode, HTMLAttributes } from "react"
  interface CommandProps {
    children?: ReactNode
    className?: string
    [key: string]: any
  }
  interface CommandInputProps {
    placeholder?: string
    className?: string
    value?: string
    onValueChange?: (value: string) => void
    [key: string]: any
  }
  interface CommandListProps {
    children?: ReactNode
    className?: string
    [key: string]: any
  }
  interface CommandEmptyProps {
    children?: ReactNode
    className?: string
    [key: string]: any
  }
  interface CommandGroupProps {
    children?: ReactNode
    heading?: string
    className?: string
    [key: string]: any
  }
  interface CommandItemProps {
    children?: ReactNode
    value?: string
    onSelect?: (value: string) => void
    disabled?: boolean
    className?: string
    [key: string]: any
  }
  interface CommandSeparatorProps {
    className?: string
    [key: string]: any
  }
  interface CommandStatic {
    (props: CommandProps): JSX.Element
    Input: FC<CommandInputProps>
    List: FC<CommandListProps>
    Empty: FC<CommandEmptyProps>
    Group: FC<CommandGroupProps>
    Item: FC<CommandItemProps>
    Separator: FC<CommandSeparatorProps>
  }
  export const Command: CommandStatic
}
