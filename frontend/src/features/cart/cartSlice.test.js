import { describe, expect, it } from 'vitest';
import reducer, { addToCart, clearCart, removeFromCart, setQuantity } from './cartSlice.js';

const sample = { _id: 'abc123', name: 'Honda Civic RS', pricePkr: 6500000 };

describe('cartSlice', () => {
  it('adds, updates quantity, removes and clears items', () => {
    let state = reducer(undefined, { type: 'init' });
    state = reducer(state, addToCart(sample));
    state = reducer(state, addToCart(sample));
    expect(state.items[0].quantity).toBe(2);

    state = reducer(state, setQuantity({ id: sample._id, quantity: 4 }));
    expect(state.items[0].quantity).toBe(4);

    state = reducer(state, removeFromCart(sample._id));
    expect(state.items).toHaveLength(0);

    state = reducer({ items: [{ ...sample, quantity: 1 }] }, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
