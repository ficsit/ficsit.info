import { declareStruct, declareReference, declareInteger, DeclarationShape } from './declare';

/**
 * Schema for `FItemAmount`.
 *
 * Struct used to specify an amount of items. E.g. a cost, a recipe product or
 * ingredient.
 * 
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/ItemAmount.h
 */
export const ItemAmountSchema = declareStruct({
  ItemClass: declareReference(),
  Amount: declareInteger(),
});

export type ItemAmount = DeclarationShape<typeof ItemAmountSchema>;
