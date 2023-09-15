class Checkout {
    constructor(pricingRules) {
      this.pricingRules = pricingRules;
      this.cart = new Map();
    }
  
    scan(item) {
      if (!this.pricingRules[item]) {
        throw new Error(`Item ${item} is not in the pricing rules.`);
      }
  
      this.cart.set(item, (this.cart.get(item) || 0) + 1);
    }
  
    calculateTotal() {
      let total = 0;
      const discountsApplied = [];
  
      for (const [item, quantity] of this.cart.entries()) {
        const rule = this.pricingRules[item];
        const unitPrice = rule.price;
  
        if (rule.type === '2-for-1' && quantity >= 2) {
          const numberOfPairs = Math.floor(quantity / 2);
          const remaining = quantity % 2;
          total += (numberOfPairs + remaining) * unitPrice;
          discountsApplied.push(`2-for-1 discount applied to ${item}`);
        } else if (rule.type === 'bulk' && quantity >= rule.minQuantity) {
          total += quantity * rule.discountedPrice;
          discountsApplied.push(`Bulk discount applied to ${item}`);
        } else {
          total += quantity * unitPrice;
        }
      }
  
      return { total: total.toFixed(2), discountsApplied };
    }
  }
  
  // Example pricing rules
  const pricingRules = {
    'VOUCHER': { type: '2-for-1', price: 5.00 },
    'TSHIRT': { type: 'bulk', price: 20.00, minQuantity: 3, discountedPrice: 19.00 },
    'MUG': { type: 'default', price: 7.50 },
  };
  
  // Example usage
  try {
    const co = new Checkout(pricingRules);
    co.scan('VOUCHER');
    co.scan('TSHIRT');
    co.scan('MUG');
    co.scan('TSHIRT');
    co.scan('TSHIRT');
    const { total, discountsApplied } = co.calculateTotal();
    console.log(`Total: ${total}€`);
    console.log('Discounts Applied:');
    discountsApplied.forEach((discount) => {
      console.log(`- ${discount}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
  
