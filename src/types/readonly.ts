import {SchemaType, withTypeSymbol} from './base'
import {isModifiedType, ModifiedType} from './modified'
import {isOptionalType, OptionalType} from './optional'
import {ReadonlyOptionalType} from './readonlyOptional'

export interface ReadonlyType<T extends SchemaType> extends ModifiedType<T> {
  readonly: true
}

type ReadonlyWrapped<T extends SchemaType> = T extends ReadonlyType<infer _>
  ? T
  : T extends OptionalType<infer U>
  ? ReadonlyOptionalType<U>
  : ReadonlyType<T>

export const readonly = <T extends SchemaType>(item: T): ReadonlyWrapped<T> => {
  if (isReadonlyType(item)) {
    return item as ReadonlyWrapped<T>
  }

  if (isOptionalType(item)) {
    const wrapped: ReadonlyOptionalType<SchemaType> = {...item, readonly: true}
    return wrapped as ReadonlyWrapped<T>
  }

  return withTypeSymbol({type: 'modified', readonly: true, item}) as ReadonlyWrapped<T>
}

export const isReadonlyType = <T extends SchemaType>(value: SchemaType<unknown>): value is ReadonlyType<T> =>
  isModifiedType(value) && value.readonly === true
