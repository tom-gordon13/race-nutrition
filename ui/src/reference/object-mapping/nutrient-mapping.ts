type NutrientReference = {
    [key: string]: {
        APP_NAME: string;
        FDC_NAME: string;
        UNITS: string;
    };
};

export const NUTRIENT_REFERENCE: NutrientReference = {
    PROTEIN: {
        APP_NAME: 'Protein',
        FDC_NAME: 'Protein',
        UNITS: 'G'
    },
    FAT: {
        APP_NAME: 'Fat',
        FDC_NAME: 'Total lipid (fat)',
        UNITS: 'G'
    },
    CARBOHYDRATE: {
        APP_NAME: 'Carbohydrates',
        FDC_NAME: 'Carbohydrate, by difference',
        UNITS: 'G'
    },
    TOTAL_SUGAR: {
        APP_NAME: 'Total Sugar',
        FDC_NAME: 'Total Sugars',
        UNITS: 'G'
    },
    FIBER: {
        APP_NAME: 'Fiber',
        FDC_NAME: 'Fiber, total dietary',
        UNITS: 'G'
    },
    CALCIUM: {
        APP_NAME: 'Calcium',
        FDC_NAME: 'Calcium, Ca',
        UNITS: 'MG'
    },
    IRON: {
        APP_NAME: 'Iron',
        FDC_NAME: 'Iron, Fe',
        UNITS: 'G'
    },
    SODIUM: {
        APP_NAME: 'Sodium',
        FDC_NAME: 'Sodium, Na',
        UNITS: 'MG'
    },
    VITAMIN_A: {
        APP_NAME: 'Vitamin A',
        FDC_NAME: 'Vitamin A, IU',
        UNITS: 'IU'
    },
    VITAMIN_C: {
        APP_NAME: 'Vitamin C',
        FDC_NAME: 'Vitamin C, total ascorbic acid',
        UNITS: 'MG'
    },
    TRANS_FAT: {
        APP_NAME: 'Trans Fat',
        FDC_NAME: 'Fatty acids, total trans',
        UNITS: 'G'
    },
    CHOLESTEROL: {
        APP_NAME: 'Cholesterol',
        FDC_NAME: 'Cholesterol',
        UNITS: 'MG'
    }
}

export const nutrientMapping: Record<string, string> = {
    'Protein': 'Protein',
    'Total lipid (fat)': 'Fat',
    'Carbohydrate, by difference': 'Carbohydrate',
    'Total Sugars': 'Total Sugar',
    'Fiber, total dietary': 'Fiber',
    'Calcium, Ca': 'Calcium',
    'Iron, Fe': 'Iron',
    'Sodium, Na': 'Sodium',
    'Vitamin A, IU': 'Vitmanin A',
    'Vitamin C, total ascorbic acid': 'Vitamin C',
    'Fatty acids, total trans': 'Trans fat',
    'Cholesterol': 'Cholesterol'
}

export const nutrientsToShow: string[] = [
    'PROTEIN',
    'FAT',
    'CARBOHYDRATE',
    'FIBER',
    'SODIUM'
]