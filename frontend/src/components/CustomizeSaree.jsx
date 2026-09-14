import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const JEWELLERY_OPTIONS = [
  { id: "temple-set", label: "Temple gold set", price: 1299 },
  { id: "pearl-set", label: "Pearl drop set", price: 899 },
];

const ACCESSORY_OPTIONS = [
  { id: "silk-potli", label: "Embroidered silk potli", price: 699 },
  { id: "brocade-clutch", label: "Brocade mini clutch", price: 899 },
];

const BLOUSE_OPTIONS = [
  { id: "classic", label: "Classic elbow sleeve", price: 0 },
  { id: "statement", label: "Statement neckline", price: 499 },
  { id: "sleeveless", label: "Modern sleeveless", price: 699 },
];

const VARIANT_OPTIONS = ["Original shade", "Deep wine", "Royal blue"];
const GIFT_WRAP_PRICE = 149;
const EXPRESS_PRICE = 249;

const formatPrice = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function CustomizeSaree({ product }) {
  const { addToCart } = useCart();
  const [variant, setVariant] = useState("Original shade");
  const [blouseStyle, setBlouseStyle] = useState("classic");
  const [jewellery, setJewellery] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [added, setAdded] = useState(false);

  const blouse = BLOUSE_OPTIONS.find((option) => option.id === blouseStyle);
  const selectedJewellery = JEWELLERY_OPTIONS.filter((option) => jewellery.includes(option.id));
  const selectedAccessories = ACCESSORY_OPTIONS.filter((option) => accessories.includes(option.id));
  const extras = [blouse, ...selectedJewellery, ...selectedAccessories];
  const extrasTotal = extras.reduce((total, option) => total + option.price, 0);
  const addOnTotal = extrasTotal + (giftWrap ? GIFT_WRAP_PRICE : 0) + (expressDelivery ? EXPRESS_PRICE : 0);
  const total = product.price + addOnTotal;

  const customization = useMemo(() => ({
    variant,
    blouseStyle,
    jewellery,
    accessories,
    giftWrap,
    giftMessage: giftMessage.trim(),
    expressDelivery,
  }), [variant, blouseStyle, jewellery, accessories, giftWrap, giftMessage, expressDelivery]);

  const toggle = (setter, id) => {
    setter((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    setAdded(false);
  };

  const addCustomizedSaree = () => {
    addToCart(product, 1, customization, total);
    setAdded(true);
  };

  return (
    <section className="customize-saree" aria-labelledby="customize-heading">
      <div className="customize-saree__header">
        <div>
          <div className="hero__eyebrow">Made personal</div>
          <h2 id="customize-heading">Customize Your Saree</h2>
          <p>Choose the finishing details and make this drape entirely yours.</p>
        </div>
        <div className="customize-saree__total"><small>Your total</small><strong>{formatPrice(total)}</strong></div>
      </div>

      <div className="customize-saree__grid">
        <fieldset className="customize-option">
          <legend><span>01</span> Saree shade</legend>
          <div className="customize-swatches">
            {VARIANT_OPTIONS.map((option) => (
              <label className={variant === option ? "is-selected" : ""} key={option}>
                <input type="radio" name="saree-variant" checked={variant === option} onChange={() => { setVariant(option); setAdded(false); }} />
                <i className={`shade-swatch shade-${option.toLowerCase().replace(" ", "-")}`} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="customize-option">
          <legend><span>02</span> Matching blouse style</legend>
          <div className="customize-choice-list">
            {BLOUSE_OPTIONS.map((option) => (
              <label className={blouseStyle === option.id ? "is-selected" : ""} key={option.id}>
                <input type="radio" name="blouse-style" checked={blouseStyle === option.id} onChange={() => { setBlouseStyle(option.id); setAdded(false); }} />
                <span>{option.label}</span><strong>{option.price ? `+${formatPrice(option.price)}` : "Included"}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="customize-option">
          <legend><span>03</span> Jewellery &amp; accessories</legend>
          <div className="customize-choice-list">
            {[...JEWELLERY_OPTIONS, ...ACCESSORY_OPTIONS].map((option) => {
              const group = JEWELLERY_OPTIONS.includes(option) ? jewellery : accessories;
              const setter = JEWELLERY_OPTIONS.includes(option) ? setJewellery : setAccessories;
              const selected = group.includes(option.id);
              return <label className={selected ? "is-selected" : ""} key={option.id}>
                <input type="checkbox" checked={selected} onChange={() => toggle(setter, option.id)} />
                <span>{option.label}</span><strong>+{formatPrice(option.price)}</strong>
              </label>;
            })}
          </div>
        </fieldset>

        <fieldset className="customize-option">
          <legend><span>04</span> Delivery &amp; gifting</legend>
          <label className={`customize-toggle${giftWrap ? " is-selected" : ""}`}>
            <input type="checkbox" checked={giftWrap} onChange={(event) => { setGiftWrap(event.target.checked); setAdded(false); }} />
            <span><strong>Gift wrap this saree</strong><small>Hand-finished with a note card</small></span><b>+{formatPrice(GIFT_WRAP_PRICE)}</b>
          </label>
          {giftWrap && <textarea className="gift-message" value={giftMessage} onChange={(event) => setGiftMessage(event.target.value)} maxLength="180" placeholder="Add a personal gift message (optional)" rows="2" />}
          <label className={`customize-toggle${expressDelivery ? " is-selected" : ""}`}>
            <input type="checkbox" checked={expressDelivery} onChange={(event) => { setExpressDelivery(event.target.checked); setAdded(false); }} />
            <span><strong>Express delivery</strong><small>Priority dispatch in 1-2 working days</small></span><b>+{formatPrice(EXPRESS_PRICE)}</b>
          </label>
        </fieldset>
      </div>

      <div className="customize-saree__summary">
        <div><span>{product.name}</span><small>{variant} · {blouse.label}</small></div>
        <strong>{formatPrice(total)}</strong>
      </div>
      <button className="btn customize-saree__button" type="button" onClick={addCustomizedSaree}>
        {added ? "Customized Saree Added ✓" : "Add Customized Saree to Cart"}
      </button>
    </section>
  );
}
