/*
 * Carta de Esquina Libertad — fuente única de datos.
 *
 * Para cambiar un precio, editá el número de `price` (sin puntos ni $).
 * Campos de cada ítem:
 *   name       nombre (obligatorio)
 *   desc       descripción / ingredientes
 *   price      precio en ARS (entero)
 *   variants   [{ label, price }] — tamaños con precio propio (pisa a `price`)
 *   options    ["Rubia", "Roja"] — opciones sin cambio de precio
 *   unit       etiqueta corta junto al nombre ("x2", "1/2 Lt", "Única medida")
 *   tags       ["vegetariano" | "vegano" | "sintacc" | "kosher"]
 *   available  false para mostrarlo tachado como "Sin stock"
 */
window.MENU = {
  settings: {
    name: "Esquina Libertad",
    discount: { percent: 15, method: "efectivo" },
    wifi: { network: "esquina libertad", password: "uriarte1501" },
    whatsapp: "5491178535357",
    whatsappLabel: "+54 9 11 7853-5357",
    instagram: "esquinalibertadok",
    currency: "ARS",
    updatedAt: "2026-10-07"
  },

  tags: {
    vegetariano: { label: "Vegetariano", filterable: true },
    vegano: { label: "Vegano", filterable: true },
    sintacc: { label: "Sin TACC", filterable: true },
    kosher: { label: "Kosher", filterable: false }
  },

  sections: [
    { id: "comida", title: "Comida", photo: "assets/photo-comida.jpg" },
    { id: "bebidas", title: "Bebidas", photo: "assets/photo-bebidas.jpg" },
    { id: "postres-y-cafe", title: "Postres y café" }
  ],

  addons: [
    {
      id: "doble-carne",
      name: "Adicional doble carne",
      price: 6000,
      category: "hamburguesas",
      exclude: ["Hamburguesa Vegetariana"]
    }
  ],

  categories: [
    /* ───────────── COMIDA ───────────── */
    {
      id: "picoteo", title: "Picoteo", section: "comida",
      items: [
        { name: "Hummus con pan árabe", price: 10000, tags: ["vegano"] },
        { name: "Buñuelos de verdura con salsa alioli", price: 14000, tags: ["vegetariano"] },
        { name: "Bastones de muzzarella con salsa fileto", price: 16000, tags: ["vegetariano"] },
        { name: "Pollo crispy", desc: "Con sésamo negro y salsa con mostaza dulce", price: 16000 },
        { name: "Berenjena al gratín", desc: "Con cebolla caramelizada, pomodoro y queso gratinado", price: 15000, tags: ["vegetariano"] },
        { name: "Tortilla de papas", desc: "Con ensalada", price: 16000, tags: ["vegetariano"] },
        { name: "Quesadilla de hongos y vegetales", desc: "Con hongos, cebolla caramelizada y morrón", price: 17000, tags: ["vegetariano"] },
        { name: "Fainá", desc: "Con hongos, cebolla caramelizada y morrón", price: 9000, tags: ["vegetariano"] },
        { name: "Fainá especial", desc: "Con queso, tomates secos y rúcula", price: 9000, tags: ["vegetariano"] },
        { name: "Tabla de papas fritas", desc: "Con 4 salsas. Para compartir", price: 13000, tags: ["vegetariano"] },
        { name: "Papas fritas", desc: "Con queso cheddar o provenzal", options: ["Cheddar", "Provenzal"], price: 10000, tags: ["vegetariano"] },
        { name: "Tabla de carnes", desc: "Tapa de asado, bondiola a la cerveza, mila de ternera, chorizo de cerdo, con pan, criolla y chimichurri", price: 28000 },
        { name: "Tabla de quesos", desc: "Queso sardo, crema de roquefort, queso Tybo, bastones de muza, aceitunas, nueces y pan", price: 26000, tags: ["vegetariano"] }
      ]
    },
    {
      id: "morfi", title: "Morfi", section: "comida",
      items: [
        { name: "Carne al horno con puré", price: 25000 },
        { name: "Bondiola braseada con batatas españolas", price: 19000 },
        { name: "Milanesa napolitana con fritas", price: 22000 },
        { name: "Milanesa de pollo", desc: "Con fritas", price: 20000 },
        { name: "Tacos de carne de ternera", desc: "Con pico de gallo y salsa picante", price: 18000 },
        { name: "Provoleta mágica con hongos", price: 18000, tags: ["vegetariano"] },
        { name: "Falafel al plato", desc: "Con hummus, tomates secos y aceitunas", price: 18000, tags: ["vegano"] },
        { name: "Wrap de bondiola braseada con papas", price: 17000 },
        { name: "Ensalada César con pollo", price: 17000 },
        { name: "Ensalada de terrina de verdes", desc: "Con naranja fresca, tomates cherry, nueces y escamas de queso reggianito", price: 16000, tags: ["vegetariano"] }
      ]
    },
    {
      id: "hamburguesas", title: "Hamburguesas", section: "comida", note: "Salen con papas",
      items: [
        { name: "Hamburguesa Clásica", desc: "90 gr. de carne, con queso, tomate, lechuga, pepinillos y salsa casera", price: 16000 },
        { name: "Hamburguesa Gringa", desc: "90 gr. de carne, con cheddar, panceta, cebolla caramelizada, huevo y salsa barbacoa", price: 17000 },
        { name: "Hamburguesa Mediterránea", desc: "Con queso crema de ciboulette, morrón asado, rúcula y roquefort", price: 17000 },
        { name: "Hamburguesa Serrana", desc: "90 gr. de carne, provolone, hongos salteados, topping de cebolla morada y mayo de ajo", price: 17000 },
        { name: "Hamburguesa Vegetariana", desc: "Con rúcula, tomate, palta y salsa alioli", price: 15000, tags: ["vegetariano"] }
      ]
    },
    {
      id: "pizzas", title: "Pizzas", section: "comida",
      items: [
        { name: "Muzzarella", price: 28000, tags: ["vegetariano"] },
        { name: "Napolitana con ajo", price: 30000, tags: ["vegetariano"] },
        { name: "Jamón y morrones asados", price: 32000 },
        { name: "Rúcula y tomates secos", price: 32000, tags: ["vegetariano"] },
        { name: "Hongos, morrones asados y cebolla", price: 32000, tags: ["vegetariano"] },
        { name: "Jamón crudo y rúcula", price: 33000 },
        { name: "Roquefort con cebolla caramelizada", price: 32000, tags: ["vegetariano"] },
        { name: "Porción de fainá", price: 3500, tags: ["vegetariano"] }
      ]
    },
    {
      id: "empanadas", title: "Empanadas", section: "comida",
      items: [
        { name: "Empanadas de carne", unit: "x2", desc: "Con salsa criolla", price: 8500 },
        { name: "Empanadas de jamón y queso", unit: "x2", price: 8000 },
        { name: "Empanadas de pollo", unit: "x2", price: 8000 },
        { name: "Fatay vegano", price: 6000, tags: ["vegano"] },
        { name: "Queppe vegano", price: 6000, tags: ["vegano"] },
        { name: "Qniche de papa", price: 6000, tags: ["vegano"] },
        { name: "Sambusak de queso", price: 6000, tags: ["vegetariano"] }
      ]
    },
    {
      id: "sandwiches", title: "Sandwiches", section: "comida", note: "Salen con papas",
      items: [
        { name: "Sandwich de bondiola braseada a la cerveza", desc: "Con ensalada coleslaw", price: 17000 },
        { name: "Sandwich de milanesa completo", desc: "Con tomate, lechuga, jamón, queso y huevo", price: 18000 },
        { name: "Sandwich de carne desmechada", desc: "Con rúcula y queso provolone", price: 18000 },
        { name: "Sandwich vegetariano de hongos macerados", desc: "Con verduras, queso y rúcula", price: 15000, tags: ["vegetariano"] }
      ]
    },
    {
      id: "sin-tacc", title: "Platos sin TACC", section: "comida",
      items: [
        { name: "Pincho de pollo con papas", price: 24000, tags: ["sintacc"] },
        { name: "Pasta", price: 22000, tags: ["sintacc"] }
      ]
    },
    {
      id: "picadas", title: "Picadas", section: "comida", layout: "cards",
      items: [
        {
          name: "Picada de fiambres",
          desc: "Cocido, crudo, salamín, queso Sardo, queso Tybo, tortilla de papas, salchi copetín, mayonesa de berenjena, crema de roquefort, aceitunas, pan artesanal",
          variants: [{ label: "Mediana", price: 44000 }, { label: "Grande", price: 59000 }]
        },
        {
          name: "Picada vegetariana",
          desc: "Zuchinis, morrones y berenjenas grillados, quesos Sardo y Tybo, hummus, fainá, bastones de muza, tortilla de papa, crema de roquefort, mayonesa de berenjena, aceitunas y pan casero",
          variants: [{ label: "Mediana", price: 44000 }, { label: "Grande", price: 59000 }],
          tags: ["vegetariano"]
        },
        {
          name: "Picada caliente", unit: "Única medida",
          desc: "Milanesitas, bastones de muza, salchi copetín, mila de pollo, tortilla de papa, quesos, bondiola braseada, fainá, crema de roquefort, mayonesa de berenjena, aceitunas, pan",
          price: 55000
        },
        {
          name: "Picada Medio Oriente", unit: "Única medida",
          desc: "Fatay, quebbe, qniche, sambusak, hummus, mayonesa de berenjena, tabule, tomates secos condimentados, pan árabe y aceitunas",
          price: 49000, tags: ["kosher"]
        }
      ]
    },

    /* ───────────── BEBIDAS ───────────── */
    {
      id: "vinos", title: "Vinos", section: "bebidas",
      items: [
        { name: "Cordero con piel de lobo Malbec", price: 20000 },
        { name: "Pokhara Malbec", price: 24000 },
        { name: "Trumpeter Malbec", price: 28000 },
        { name: "Kamala Pinot Noir", price: 28000 },
        { name: "Nicasia", options: ["Blend de Malbec", "Cabernet Franc"], price: 29000 },
        { name: "El Moradito blend de Criollas", price: 24000 },
        { name: "Oralia Naranjo de Malvasía", price: 27000 },
        { name: "Trumpeter Chardonnay", price: 25000 },
        { name: "Pokhara Chenin blanco", price: 23000 },
        { name: "Como pez en el agua Rosé", price: 22000 },
        { name: "Copa de vino", options: ["Tinto", "Blanco", "Rosado"], price: 8000 },
        { name: "Navarro Correa Extra Brut", price: 30000 }
      ]
    },
    {
      id: "birras", title: "Birras", section: "bebidas",
      items: [
        { name: "Pinta Patagonia", options: ["IPA", "Roja"], price: 7000 },
        { name: "Pinta Quilmes Rubia", price: 5000 },
        { name: "Stella", unit: "1 Lt", price: 14000 },
        { name: "Andes", unit: "1 Lt", options: ["Rubia", "Roja", "IPA"], price: 12000 },
        { name: "Jarra Quilmes", unit: "1,5 Lts", price: 19000 },
        { name: "Minga lata", unit: "500 cc", options: ["Rubia", "Roja", "IPA", "Stout", "APA"], price: 8500 },
        { name: "Andes lata", unit: "500 cc", options: ["Rubia", "Roja", "IPA"], price: 7000 },
        { name: "Corona porrón", price: 7500 },
        { name: "Porrón sin alcohol", options: ["Corona", "Stella"], price: 7000 }
      ]
    },
    {
      id: "vermut", title: "Vermut y aperitivos", section: "bebidas", note: "1/2 LT",
      items: [
        { name: "Vermú Lunfa", options: ["Blanco", "Rosso"], price: 9000 },
        { name: "Vermú Cinzano", price: 9000 },
        { name: "Fernet Branca con Coca", price: 10000 },
        { name: "Tinto de verano", price: 9000 },
        { name: "Aperol Spritz", price: 10000 },
        { name: "Amargo Obrero", price: 9000 },
        { name: "Cynar con pomelo", price: 9000 },
        { name: "Campari", price: 9000 },
        { name: "Ramazzotti Spritz", price: 10000 },
        { name: "Ferroviario", price: 9000 }
      ]
    },
    {
      id: "tragos-de-autor", title: "Tragos de autor", section: "bebidas",
      items: [
        { name: "Ala Delta", desc: "Vermut Lunfa blanco, gin, menta, soda", price: 10000 },
        { name: "SUMO", desc: "Gin Macedonio, vino blanco dulce, Ramazzotti, durazno", price: 12000 },
        { name: "BB King", desc: "Whisky Jameson, vermut Lunfa, shot de café, almíbar", price: 15000 },
        { name: "Red Hot", desc: "Campari, vino blanco, jugo de naranja, cerveza IPA", price: 12000 },
        { name: "Tarea Fina", desc: "Bourbon, vermut rosso, angostura, bitter naranja", price: 15000 },
        { name: "Tinto de Otoño", desc: "Vino tinto, Gin 40 Botánicos, jugo de naranja, vermut, nueces, tónica", price: 14000 },
        { name: "Reggaetón Noruego", desc: "Vodka, vino blanco seco, lima, maraschino, ananá", price: 12000 },
        { name: "Whisky Sour", desc: "Johnnie Red, clara de huevo, naranja, touch de fernet", price: 15000 },
        { name: "Amapola", desc: "Gin Macedonio, pomelo, hojas de menta", price: 13000 }
      ]
    },
    {
      id: "tragos", title: "Tragos", section: "bebidas",
      items: [
        { name: "Gin Tonic Heráclito", price: 10000 },
        { name: "Gin Tonic Beefeater", price: 14000 },
        { name: "Ron con Coca", price: 9000 },
        { name: "Caipirinha o Caipiroska", options: ["Caipirinha", "Caipiroska"], price: 10000 },
        { name: "Mojito con Havana Club", price: 9000 },
        { name: "Negroni", price: 9000 },
        { name: "Old Fashioned", price: 16000 },
        { name: "Boulevardier", price: 16000 },
        { name: "Espresso Martini", price: 12000 },
        { name: "Destornillador", price: 9000 },
        { name: "Jager Julep", price: 14000 }
      ]
    },
    {
      id: "mocktails", title: "Mocktails", section: "bebidas", note: "Tragos sin alcohol",
      items: [
        { name: "No mojito", price: 8000 },
        { name: "Aterciopelado", desc: "Afrutado", price: 8000 },
        { name: "Dulce noche", price: 8000 },
        { name: "Iced Tea", price: 8000 },
        { name: "Limonada especial de Cami", desc: "Con pulpa de ananá", price: 7000 }
      ]
    },
    {
      id: "sidra", title: "Sidra artesanal", section: "bebidas",
      items: [
        { name: "Dry", price: 10000 },
        { name: "Frutos rojos", price: 10000 },
        { name: "Pera", price: 10000 }
      ]
    },
    {
      id: "whiskies", title: "Whiskies", section: "bebidas",
      items: [
        { name: "Johnnie Walker Red", price: 15000 },
        { name: "Johnnie Walker Negro", price: 19000 },
        { name: "Jameson", price: 15000 },
        { name: "Jack Daniel's", price: 20000 },
        { name: "Wild Turkey", price: 15000 }
      ]
    },
    {
      id: "sin-alcohol", title: "Sin alcohol", section: "bebidas",
      items: [
        { name: "Gaseosas línea Coca", price: 4500 },
        { name: "Agua", options: ["Con gas", "Sin gas"], price: 3500 },
        { name: "Limonada con menta y almíbar de jengibre", unit: "1/2 Lt", price: 5000 },
        { name: "Limonada con maracuyá", price: 5500 }
      ]
    },

    /* ───────────── POSTRES Y CAFÉ ───────────── */
    {
      id: "postres", title: "Postres", section: "postres-y-cafe",
      items: [
        { name: "Chocotorta", price: 10000 },
        { name: "Tarta de manzana con bocha de crema americana", price: 10000 },
        { name: "Brownie con bocha de crema americana", price: 10000 },
        { name: "Flan mixto", price: 8000 }
      ]
    },
    {
      id: "cafe", title: "Café", section: "postres-y-cafe",
      items: [
        { name: "Café", price: 4000 },
        { name: "Café cortado", price: 4500 },
        { name: "Café con leche", price: 5000 },
        { name: "Café o cortado en jarrito", options: ["Café", "Cortado"], price: 5000 }
      ]
    }
  ]
};
