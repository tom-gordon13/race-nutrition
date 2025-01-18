const itemMetaFields: string[] = [
    'Item Name',
    'Item Brand',
    'Item Category'
]

export const nutrientsToShow: string[] = [
    'Protein',
    'Fat',
    'Carbohydrate',
    'Fiber',
    'Sodium'
]

const numericFieldPattern = /^[0-9]*\.?[0-9]*$/

const fieldValidation: Record<string, (value: string) => boolean> = {
    numericField: (value) => numericFieldPattern.test(value),
    textField: () => true,
};

export const customItemFormFields: object = {
    itemName: { publicName: 'Item Name', validationType: 'textField', formCategory: 'metaData', helpText: 'test', required: true },
    itemBrand: { publicName: 'Item Brand', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    itemCategory: { publicName: 'Item Category', validationType: 'textField', formCategory: 'metaData', helpText: 'test' },
    protein: { publicName: 'Protein', validationType: 'numericField', formCategory: 'nutrients', helpText: 'test' },
    fat: { publicName: 'Fat', validationType: 'numericField', formCategory: 'nutrients', helpText: 'test' },
    carbohydrate: { publicName: 'Carbohydrate', validationType: 'numericField', formCategory: 'nutrients', helpText: 'test' },
    fiber: { publicName: 'Fiber', validationType: 'numericField', formCategory: 'nutrients', helpText: 'test' },
    sodium: { publicName: 'Sodium', validationType: 'numericField', formCategory: 'nutrients', helpText: 'test' },
}