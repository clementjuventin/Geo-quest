import {
    UserModel,
    LocationModel,
    QuestModel,
    UserClaimModel
} from "../models";
import bcrypt from "bcrypt";
import db from "../models/database"

// eslint-disable-next-line no-unexpected-multiline
(async () => {
    // Gen database
    await db.sync({ force: true })

    // USERS
    const passhash = await bcrypt.hash('test', 10)
    await UserModel.create({
        username: 'mike', passhash
    })
    await UserModel.create({
        username: 'tip', passhash
    })
    await UserModel.create({
        username: 'eva', passhash
    })
    await UserModel.create({
        username: 'cle', passhash
    })
    await UserModel.create({
        username: 'chad', passhash
    })
    await UserModel.create({
        username: 'ary', passhash
    })
    await UserModel.create({
        username: 'nath', passhash
    })
    await UserModel.create({
        username: 'seb', passhash
    })

    // QUESTS
    await QuestModel.create({
        name: 'Paris tour',
        description: 'Visite de Paris',
        creatorId: 1,
        code: '12345678901234567890123456789012',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg/640px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
    })
    await QuestModel.create({
        name: 'Grenoble INP',
        description: 'Visite de toutes les écoles INP de Grenoble',
        creatorId: 1,
        code: '12345678901234567890123456789010',
        img: 'data:image/jpeg;base64,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',
    })
    await QuestModel.create({
        name: 'Grenoble',
        description: 'Visite de Grenoble',
        creatorId: 2,
        code: '25645545654862455556525aqdzhehzh'
    })
    await QuestModel.create({
        name: 'Annecy',
        description: 'Visite du Lac et de ses alentours (2012)',
        creatorId: 1,
        code: '24545545214514215521478957827249',
        img: 'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQWxI39TWEPEbcFPyoaSM2W3xBGRthYu81p9-ugKY-xMpR9OyCnEY-9oX1D_NjA5yu6',
        active: true,
        endDate: '2017-01-01'
    });
    await QuestModel.create({
        name: 'Annecy',
        description: 'Visite du Lac et de ses alentours (2020)',
        creatorId: 1,
        code: '24545545214514215521478957827250',
        img: 'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQWxI39TWEPEbcFPyoaSM2W3xBGRthYu81p9-ugKY-xMpR9OyCnEY-9oX1D_NjA5yu6',
        active: true,
        endDate: '2025-01-01'
    });

    // LOCATIONS
    await LocationModel.create({
        questId: 1,
        name: 'La tour Eiffel',
        description: 'La tour Eiffel est une tour de fer puddlé de 324 mètres de hauteur (avec antennes) située à Paris, à l’extrémité nord-ouest du parc du Champ-de-Mars en bordure de la Seine dans le 7e arrondissement. Son adresse officielle est 5, avenue Anatole-France.',
        latitude: 48.85837009999999,
        longitude: 2.2944813,
        code: '789456123'
    });
    await LocationModel.create({
        questId: 1,
        name: 'Le Louvre',
        description: 'Le musée du Louvre est un musée d\'art et d\'antiquités situé au centre de Paris dans le palais du Louvre. C\'est l\'un des plus grands musées du monde, et le plus grand de Paris, par sa surface d\'exposition de 72 735 m2.',
        latitude: 48.8606111,
        longitude: 2.337644,
        code: '7894561232452452'
    });
    await LocationModel.create({
        questId: 1,
        name: 'La cathédrale Notre-Dame de Paris',
        description: 'La cathédrale Notre-Dame de Paris, Notre-Dame, est la cathédrale de l’archidiocèse de Paris, en France. Elle est située dans l’est de l’île de la Cité, dans le 4e arrondissement de Paris.',
        latitude: 48.85296820000001,
        longitude: 2.3499021
    });
    await LocationModel.create({
        questId: 1,
        name: 'Arc de Triomphe',
        description: 'L’arc de triomphe de l’Étoile souvent appelé simplement l’Arc de Triomphe, dont la construction, décidée par l\'empereur Napoléon Ier, débuta en 1806 et s\'acheva en 1836 sous Louis-Philippe, est situé à Paris, dans le 8e arrondissement, sur la place de l\'Étoile, au centre de la place Charles-de-Gaulle, anciennement appelée « place de l\'Étoile ».',
        latitude: 48.8737917,
        longitude: 2.2950275
    });

    await LocationModel.create({
        questId: 2,
        name: 'ENSIMAG',
        description: 'L\'École nationale supérieure d\'informatique et de mathématiques appliquées de Grenoble, ou ENSIMAG, est l\'une des 205 écoles d\'ingénieurs françaises accréditées au 1ᵉʳ septembre 2019 à délivrer un diplôme d\'ingénieur.',
        latitude: 45.193287,
        longitude: 5.768395737859304,
    });
    await LocationModel.create({
        questId: 2,
        name: 'PHELMA',
        description: 'Phelma est l\'une des 205 écoles d\'ingénieurs françaises accréditées au 1ᵉʳ septembre 2019 à délivrer un diplôme d\'ingénieur. Elle est située à Grenoble, dans le quartier de la presqu\'île scientifique.',
        latitude: 45.196301250000005,
        longitude: 5.771911022365904,
    });
    await LocationModel.create({
        questId: 3,
        name: 'Lac',
        description: 'Le lac d\'Annecy est l\'un des plus grand lacs de France.',
        latitude: 47.1,
        longitude: 7.2,
        code: '478548754787545321584'
    });
    await LocationModel.create({
        questId: 4,
        name: 'Lac',
        description: 'Le lac d\'Annecy est l\'un des plus grand lacs de France.',
        latitude: 47.1,
        longitude: 7.2,
        code: '24545452361215412789'
    });
    await LocationModel.create({
        questId: 5,
        name: 'Lac',
        description: 'Le lac d\'Annecy est l\'un des plus grand lacs de France.',
        latitude: 47.1,
        longitude: 7.2,
        code: '24545452361215412788'
    });

    // USER CLAIM MODEL
    await UserClaimModel.create({
        userId: 2,
        locationId: 5,
    });
    await UserClaimModel.create({
        userId: 2,
        locationId: 4,
        date: "2001-01-01"
    });

    await UserModel.destroy({
        where: {
            username: "test-cypress-bis"
        },
    });
})()
