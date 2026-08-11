import hero from "./hero.jpg";
import logo from "./logo.svg";
import add_icon from "./add.svg";
import arrow_icon from "./arrow.svg";
import cart_icon from "./cart.svg";
import menu_icon from "./menu.svg";
import search_icon from "./search.svg";
import khalti_logo from "./khalti_logo.png";
import esewa_logo from "./esewa_logo.png";

// importing product images
import sofa1_1 from "./sofa1_1.png";
import sofa1_2 from "./sofa1_2.png";
import sofa2_1 from "./sofa2_1.png";
import sofa3_1 from "./sofa3_1.png";
import sofa4_1 from "./sofa4_1.png";
import sofa5_1 from "./sofa5_1.png";
import sofa6_1 from "./sofa6_1.png";
import sofa7_1 from "./sofa7_1.png";
import sofa8_1 from "./sofa8_1.png";
import sofa9_1 from "./sofa9_1.png";
import sofa10_1 from "./sofa10_1.png";
import sofa11_1 from "./sofa11_1.png";
import sofa12_1 from "./sofa12_1.png";
import sofa13_1 from "./sofa13_1.png";
import sofa14_1 from "./sofa14__1.png";

export const assets = {
  hero,
  logo,
  add_icon,
  arrow_icon,
  cart_icon,
  menu_icon,
  search_icon,
  esewa_logo,
  khalti_logo,
};

export const products = [
  {
    _id: "sofa001",
    name: "Nordic Linen Sofa",
    description:
      "Minimal Scandinavian sofa with premium linen upholstery and solid oak legs.",
    price: 649,
    image: [sofa1_1, sofa1_2],
    room: "Living Room",
    material: "Fabric",
    seating: "3 Seater",
    style: "Scandinavian",
    color: "Beige",
    date: 1716621345448,
    bestseller: true,
  },
  {
    _id: "sofa002",
    name: "Modern Velvet Sofa",
    description:
      "Soft velvet sofa offering luxurious comfort and elegant styling.",
    price: 799,
    image: [sofa2_1],
    room: "Living Room",
    material: "Velvet",
    seating: "3 Seater",
    style: "Modern",
    color: "Emerald",
    date: 1716621345449,
    bestseller: true,
  },
  {
    _id: "sofa003",
    name: "Urban Compact Sofa",
    description: "Space-saving sofa designed for apartments and modern homes.",
    price: 499,
    image: [sofa3_1],
    room: "Living Room",
    material: "Fabric",
    seating: "2 Seater",
    style: "Modern",
    color: "Cream",
    date: 1716621345450,
    bestseller: false,
  },
  {
    _id: "sofa004",
    name: "Luxury Chesterfield",
    description:
      "Classic Chesterfield with deep button tufting and timeless appeal.",
    price: 1199,
    image: [sofa4_1],
    room: "Living Room",
    material: "Leather",
    seating: "3 Seater",
    style: "Classic",
    color: "Brown",
    date: 1716621345451,
    bestseller: true,
  },
  {
    _id: "sofa005",
    name: "Cloud Comfort Sofa",
    description: "Ultra-soft cushions designed for maximum relaxation.",
    price: 899,
    image: [sofa5_1],
    room: "Living Room",
    material: "Fabric",
    seating: "4 Seater",
    style: "Modern",
    color: "White",
    date: 1716621345452,
    bestseller: true,
  },
  {
    _id: "sofa006",
    name: "Walnut Frame Sofa",
    description: "Premium wooden frame combined with plush seating.",
    price: 749,
    image: [sofa6_1],
    room: "Living Room",
    material: "Wood",
    seating: "3 Seater",
    style: "Contemporary",
    color: "Beige",
    date: 1716621345453,
    bestseller: false,
  },
  {
    _id: "sofa007",
    name: "Minimal Beige Sofa",
    description:
      "Elegant neutral-toned sofa perfect for contemporary interiors.",
    price: 679,
    image: [sofa7_1],
    room: "Living Room",
    material: "Fabric",
    seating: "3 Seater",
    style: "Minimal",
    color: "Beige",
    date: 1716621345454,
    bestseller: true,
  },
  {
    _id: "sofa008",
    name: "Luxe Corner Sofa",
    description: "Spacious L-shaped sofa with premium upholstery.",
    price: 1399,
    image: [sofa8_1],
    room: "Living Room",
    material: "Fabric",
    seating: "L Shape",
    style: "Modern",
    color: "Gray",
    date: 1716621345455,
    bestseller: false,
  },
  {
    _id: "sofa009",
    name: "Classic Leather Sofa",
    description: "Top-grain leather sofa with exceptional durability.",
    price: 1499,
    image: [sofa9_1],
    room: "Living Room",
    material: "Leather",
    seating: "3 Seater",
    style: "Classic",
    color: "Black",
    date: 1716621345456,
    bestseller: true,
  },
  {
    _id: "sofa010",
    name: "Cozy Family Sofa",
    description: "Designed for family comfort with deep supportive cushions.",
    price: 999,
    image: [sofa10_1],
    room: "Living Room",
    material: "Fabric",
    seating: "4 Seater",
    style: "Contemporary",
    color: "Cream",
    date: 1716621345457,
    bestseller: true,
  },
  {
    _id: "sofa011",
    name: "Harmony Sofa",
    description: "Simple elegance for modern homes.",
    price: 699,
    image: [sofa11_1],
    room: "Living Room",
    material: "Fabric",
    seating: "3 Seater",
    style: "Minimal",
    color: "Taupe",
    date: 1716621345458,
    bestseller: false,
  },
  {
    _id: "sofa012",
    name: "Monarch Sofa",
    description: "Luxury handcrafted sofa with premium fabric.",
    price: 1299,
    image: [sofa12_1],
    room: "Living Room",
    material: "Fabric",
    seating: "3 Seater",
    style: "Luxury",
    color: "Ivory",
    date: 1716621345459,
    bestseller: true,
  },
  {
    _id: "sofa013",
    name: "Metro Sofa",
    description: "Compact seating solution for urban apartments.",
    price: 559,
    image: [sofa13_1],
    room: "Living Room",
    material: "Fabric",
    seating: "2 Seater",
    style: "Modern",
    color: "Gray",
    date: 1716621345460,
    bestseller: false,
  },
  {
    _id: "sofa014",
    name: "Prestige Sofa",
    description: "Elegant curved silhouette with premium cushioning.",
    price: 1049,
    image: [sofa14_1],
    room: "Living Room",
    material: "Fabric",
    seating: "3 Seater",
    style: "Luxury",
    color: "Beige",
    date: 1716621345461,
    bestseller: true,
  },
];
