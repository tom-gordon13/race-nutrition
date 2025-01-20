import { NUTRIENT_REFERENCE } from "../object-mapping/nutrient-mapping";

const numericFieldPattern = /^[0-9]*\.?[0-9]*$/

export const fieldValidation: Record<string, (value: string) => boolean> = {
    numericField: (value) => numericFieldPattern.test(value),
    textField: () => true,
};

export const customItemFormFields: object = {
    itemName: { publicName: 'Item Name', validationType: 'textField', formCategory: 'metaData', helpText: 'test', required: true },
    itemBrand: { publicName: 'Item Brand', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    itemCategory: { publicName: 'Item Category', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    protein: { publicName: NUTRIENT_REFERENCE.PROTEIN.APP_NAME, validationType: 'numericField', formCategory: 'nutrients', helpText: `Quantity (per serving) in ${NUTRIENT_REFERENCE.PROTEIN.UNITS}` },
    fat: { publicName: NUTRIENT_REFERENCE.FAT.APP_NAME, validationType: 'numericField', formCategory: 'nutrients', helpText: `Quantity (per serving) in ${NUTRIENT_REFERENCE.FAT.UNITS}` },
    carbohydrate: { publicName: NUTRIENT_REFERENCE.CARBOHYDRATE.APP_NAME, validationType: 'numericField', formCategory: 'nutrients', helpText: `Quantity (per serving) in ${NUTRIENT_REFERENCE.CARBOHYDRATE.UNITS}` },
    fiber: { publicName: NUTRIENT_REFERENCE.FIBER.APP_NAME, validationType: 'numericField', formCategory: 'nutrients', helpText: `Quantity (per serving) in ${NUTRIENT_REFERENCE.FIBER.UNITS}` },
    sodium: { publicName: NUTRIENT_REFERENCE.SODIUM.APP_NAME, validationType: 'numericField', formCategory: 'nutrients', helpText: `Quantity (per serving) in ${NUTRIENT_REFERENCE.SODIUM.UNITS}` },
}