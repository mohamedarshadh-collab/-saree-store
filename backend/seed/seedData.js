// Demo product data — five unique products per category.
const imageSets = {
  "Pattu Sarees": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Embroidery_on_a_saree_01.jpg/960px-Embroidery_on_a_saree_01.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Embroidery_on_a_saree_04.jpg/960px-Embroidery_on_a_saree_04.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/A_silk_saree_loom_in_Kumbakonam%2C_Tamil_Nadu.jpg/960px-A_silk_saree_loom_in_Kumbakonam%2C_Tamil_Nadu.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Banarasi_Silk_Saree.jpg/960px-Banarasi_Silk_Saree.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/%27Sari%27_from_Varanasi_%28north-central_India%29%2C_silk_and_gold-wrapped_silk_yarn_with_supplementary_weft_brocade.jpg",
  ],
  "Fancy Sarees": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Sari_on_mannequin_for_demo.jpg/960px-Sari_on_mannequin_for_demo.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Saree_on_display_at_Dilli_Haat.JPG/960px-Saree_on_display_at_Dilli_Haat.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/Red_saree_look_for_girl.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Peach_saree.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Sari_2.jpg/960px-Sari_2.jpg",
  ],
  "Georgette Sarees": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Saree_image.jpg/960px-Saree_image.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8c/Saree_draping.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sambhalpuri_Saree_%28Blue%29.jpg/960px-Sambhalpuri_Saree_%28Blue%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Nepali_Bride.jpg/960px-Nepali_Bride.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Inde_bondo8658a.jpg/960px-Inde_bondo8658a.jpg",
  ],
  "Party Wear Sarees": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Paoli_Dam_saree_image.jpg/960px-Paoli_Dam_saree_image.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Shriya_Saran_in_Blue_Saree.jpg/960px-Shriya_Saran_in_Blue_Saree.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Amyra_Dastur_snapped_sporting_a_vintage_saree_look_%2802%29.jpg/960px-Amyra_Dastur_snapped_sporting_a_vintage_saree_look_%2802%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Amyra_Dastur_snapped_sporting_a_vintage_saree_look_%2806%29.jpg/960px-Amyra_Dastur_snapped_sporting_a_vintage_saree_look_%2806%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Two_girls_wearing_sarees_%2C_Blue_%28Malathi%29%2C_Orange_%28Shara%29_at_Ladies_party%2C_Veracious_Sonesta._%2C_Bangalore%2C_2011.jpg/960px-Two_girls_wearing_sarees_%2C_Blue_%28Malathi%29%2C_Orange_%28Shara%29_at_Ladies_party%2C_Veracious_Sonesta._%2C_Bangalore%2C_2011.jpg",
  ],
  "Cotton Sarees": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Cotton-mulmul-saree-with-blouse-5-1.jpg/960px-Cotton-mulmul-saree-with-blouse-5-1.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Mulmul_cotton_Saree.jpg/960px-Mulmul_cotton_Saree.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/BD_Tangail_3.JPG/960px-BD_Tangail_3.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/BD_Tangail_4.JPG/960px-BD_Tangail_4.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Border_of_Tangail_sari%2Cfrom_the_1970s.jpg/960px-Border_of_Tangail_sari%2Cfrom_the_1970s.jpg",
  ],
  Others: [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Banarasi_sari_pallu_by_ashish4.JPG/960px-Banarasi_sari_pallu_by_ashish4.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Crape_silk_fabric_Banarasi_work_bandhani_saree.jpg/960px-Crape_silk_fabric_Banarasi_work_bandhani_saree.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Banarasi_Sari_on_viewing_wooden_blocks_01.jpg/960px-Banarasi_Sari_on_viewing_wooden_blocks_01.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Alkama_Ansari_-_A_Banarasi_Saree_Weaver.jpg/960px-Alkama_Ansari_-_A_Banarasi_Saree_Weaver.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/A_young_artist_weaving_creativity_into_every_thread%2C_crafting_a_beautiful_handicraft_saree_with_precision_and_passion.jpg/960px-A_young_artist_weaving_creativity_into_every_thread%2C_crafting_a_beautiful_handicraft_saree_with_precision_and_passion.jpg",
  ],
};

const img = (category, index, variant) => {
  const base = imageSets[category][index];
  const saturation = (variant % 7) * 12 - 36;
  const hue = (variant * 47) % 360;
  return `${base}?auto=format&fit=crop&w=600&h=800&q=85&sat=${saturation}&hue=${hue}`;
};

const sarees = [
  { name: "Kanchipuram Pattu Silk Saree", category: "Pattu Sarees", price: 6499, mrp: 8999, fabric: "Kanchipuram Silk", color: "Maroon & Gold", sku: "PAT-001" },
  { name: "Mysore Pattu Silk Saree", category: "Pattu Sarees", price: 5299, mrp: 7499, fabric: "Mysore Silk", color: "Royal Blue", sku: "PAT-002" },
  { name: "Temple Border Pattu Saree", category: "Pattu Sarees", price: 7199, mrp: 9999, fabric: "Pure Silk", color: "Wine Red", sku: "PAT-003" },
  { name: "Bridal Pattu Silk Saree", category: "Pattu Sarees", price: 12999, mrp: 16999, fabric: "Pure Kanjivaram Silk", color: "Crimson & Gold", sku: "PAT-004" },
  { name: "Zari Woven Pattu Saree", category: "Pattu Sarees", price: 5899, mrp: 7999, fabric: "Silk Blend", color: "Emerald Green", sku: "PAT-005" },
  { name: "Sequin Work Fancy Saree", category: "Fancy Sarees", price: 2199, mrp: 3499, fabric: "Net", color: "Peacock Blue", sku: "FAN-001" },
  { name: "Printed Fancy Chiffon Saree", category: "Fancy Sarees", price: 1499, mrp: 2299, fabric: "Chiffon", color: "Pastel Pink", sku: "FAN-002" },
  { name: "Embellished Fancy Saree", category: "Fancy Sarees", price: 2799, mrp: 3999, fabric: "Satin", color: "Champagne Gold", sku: "FAN-003" },
  { name: "Digital Print Fancy Saree", category: "Fancy Sarees", price: 1699, mrp: 2499, fabric: "Poly Silk", color: "Turquoise", sku: "FAN-004" },
  { name: "Stone Work Fancy Saree", category: "Fancy Sarees", price: 2999, mrp: 4299, fabric: "Net", color: "Blush Pink", sku: "FAN-005" },
  { name: "Floral Print Georgette Saree", category: "Georgette Sarees", price: 1899, mrp: 2799, fabric: "Georgette", color: "Coral", sku: "GEO-001" },
  { name: "Ruffle Border Georgette Saree", category: "Georgette Sarees", price: 2299, mrp: 3299, fabric: "Georgette", color: "Mustard Yellow", sku: "GEO-002" },
  { name: "Embroidered Georgette Saree", category: "Georgette Sarees", price: 2599, mrp: 3799, fabric: "Georgette", color: "Sea Green", sku: "GEO-003" },
  { name: "Ombre Georgette Saree", category: "Georgette Sarees", price: 2099, mrp: 2999, fabric: "Georgette", color: "Lavender Ombre", sku: "GEO-004" },
  { name: "Plain Georgette Saree with Lace Border", category: "Georgette Sarees", price: 1599, mrp: 2399, fabric: "Georgette", color: "Beige", sku: "GEO-005" },
  { name: "Shimmer Party Wear Saree", category: "Party Wear Sarees", price: 3299, mrp: 4799, fabric: "Shimmer Net", color: "Wine", sku: "PWS-001" },
  { name: "Designer Ruffle Party Saree", category: "Party Wear Sarees", price: 3999, mrp: 5799, fabric: "Georgette", color: "Black & Gold", sku: "PWS-002" },
  { name: "Velvet Blouse Party Wear Saree", category: "Party Wear Sarees", price: 4499, mrp: 6499, fabric: "Satin & Velvet", color: "Deep Purple", sku: "PWS-003" },
  { name: "Cocktail Sequin Saree", category: "Party Wear Sarees", price: 3699, mrp: 5299, fabric: "Net", color: "Silver Grey", sku: "PWS-004" },
  { name: "Halter Neck Style Party Saree", category: "Party Wear Sarees", price: 4199, mrp: 5999, fabric: "Satin", color: "Teal", sku: "PWS-005" },
  { name: "Handloom Cotton Saree", category: "Cotton Sarees", price: 1299, mrp: 1899, fabric: "Pure Cotton", color: "Off White & Red", sku: "COT-001" },
  { name: "Block Print Cotton Saree", category: "Cotton Sarees", price: 999, mrp: 1499, fabric: "Cotton", color: "Indigo Blue", sku: "COT-002" },
  { name: "Chettinad Cotton Saree", category: "Cotton Sarees", price: 1599, mrp: 2199, fabric: "Chettinad Cotton", color: "Mustard & Black", sku: "COT-003" },
  { name: "Mangalgiri Cotton Saree", category: "Cotton Sarees", price: 1099, mrp: 1599, fabric: "Cotton", color: "Sky Blue", sku: "COT-004" },
  { name: "Kalamkari Cotton Saree", category: "Cotton Sarees", price: 1799, mrp: 2499, fabric: "Cotton", color: "Rust Orange", sku: "COT-005" },
  { name: "Linen Saree with Zari Border", category: "Others", price: 2399, mrp: 3399, fabric: "Linen", color: "Olive Green", sku: "OTH-001" },
  { name: "Organza Saree", category: "Others", price: 2899, mrp: 4099, fabric: "Organza", color: "Ivory", sku: "OTH-002" },
  { name: "Banarasi Silk Blend Saree", category: "Others", price: 3499, mrp: 4999, fabric: "Silk Blend", color: "Magenta", sku: "OTH-003" },
  { name: "Tussar Silk Saree", category: "Others", price: 2699, mrp: 3899, fabric: "Tussar Silk", color: "Golden Beige", sku: "OTH-004" },
  { name: "Chanderi Silk Cotton Saree", category: "Others", price: 1999, mrp: 2899, fabric: "Chanderi", color: "Powder Blue", sku: "OTH-005" },
];

const seedData = sarees.map((s, i) => ({
  ...s,
  images: [img(s.category, i % 5, i), img(s.category, (i + 1) % 5, i + sarees.length)],
  description: `${s.name} in ${s.color.toLowerCase()}, crafted from ${s.fabric.toLowerCase()}. Comes with a matching unstitched blouse piece. Dry clean recommended.`,
  blouseIncluded: true,
  discountPercent: Math.round(((s.mrp - s.price) / s.mrp) * 100),
  rating: (4 + Math.random()).toFixed(1) * 1,
  ratingCount: Math.floor(Math.random() * 300) + 20,
  stock: Math.floor(Math.random() * 40) + 10,
}));

module.exports = seedData;
