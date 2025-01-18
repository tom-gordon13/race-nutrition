const numericFieldPattern = /^[0-9]*\.?[0-9]*$/

export const fieldValidation: Record<string, (value: string) => boolean> = {
    numericField: (value) => numericFieldPattern.test(value),
    textField: () => true,
};

export const customItemFormFields: object = {
    itemName: { publicName: 'Item Name', validationType: 'textField', formCategory: 'metaData', helpText: 'test', required: true },
    itemBrand: { publicName: 'Item Brand', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    itemCategory: { publicName: 'Item Category', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    protein: { publicName: 'Protein', validationType: 'numericField', formCategory: 'nutrients', helpText: 'Quantity in Grams' },
    fat: { publicName: 'Fat', validationType: 'numericField', formCategory: 'nutrients', helpText: 'Quantity in Grams' },
    carbohydrate: { publicName: 'Carbohydrate', validationType: 'numericField', formCategory: 'nutrients', helpText: 'Quantity in Grams' },
    fiber: { publicName: 'Fiber', validationType: 'numericField', formCategory: 'nutrients', helpText: 'Quantity in Grams' },
    sodium: { publicName: 'Sodium', validationType: 'numericField', formCategory: 'nutrients', helpText: 'Quantity in Milligrams' },
}