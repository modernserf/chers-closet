import { query, r } from './db'

export const db = [
    r.wearing_src('white-shirt', require('./img/top-1.png')),
    r.preview_src('white-shirt', require('./img/white-shirt.png')),
    r.position('white-shirt', 'shirt'),
    r.formality('white-shirt', 'formal'),
    r.color('white-shirt', 'white'),

    r.wearing_src('plaid-shirt', require('./img/top-2.png')),
    r.preview_src('plaid-shirt', require('./img/plaid.png')),
    r.position('plaid-shirt', 'shirt'),
    r.formality('plaid-shirt', 'informal'),
    r.color('plaid-shirt', 'brown'),

    r.wearing_src('gray-shirt', require('./img/top-3.png')),
    r.preview_src('gray-shirt', require('./img/gray-shirt.png')),
    r.position('gray-shirt', 'shirt'),
    r.formality('gray-shirt', 'formal'),
    r.formality('gray-shirt', 'informal'),
    r.color('gray-shirt', 'gray'),

    r.wearing_src('chinos', require('./img/bottom-1.png')),
    r.preview_src('chinos', require('./img/chinos.png')),
    r.position('chinos', 'pants'),
    r.formality('chinos', 'formal'),
    r.color('chinos', 'gray'),
    r.tone('chinos', 'cool'),

    r.wearing_src('jeans', require('./img/bottom-2.png')),
    r.preview_src('jeans', require('./img/jeans.png')),
    r.position('jeans', 'pants'),
    r.formality('jeans', 'informal'),
    r.color('jeans', 'gray'),
    r.tone('jeans', 'warm'),
    r.tone('jeans', 'cool'),

    r.wearing_src('khakis', require('./img/bottom-3.png')),
    r.preview_src('khakis', require('./img/khaki.png')),
    r.position('khakis', 'pants'),
    r.formality('khakis', 'formal'),
    r.formality('khakis', 'informal'),
    r.color('khakis', 'tan'),
    r.tone('khakis', 'warm'),

    r.wearing_src('wingtips', require('./img/shoe-1.png')),
    r.position('wingtips', 'shoes'),
    r.formality('wingtips', 'formal'),
    r.tone('wingtips', 'cool'),

    r.wearing_src('sneakers', require('./img/shoe-2.png')),
    r.position('sneakers', 'shoes'),
    r.formality('sneakers', 'informal'),
    r.tone('sneakers', 'cool'),

    r.wearing_src('boots', require('./img/shoe-3.png')),
    r.position('boots', 'shoes'),
    r.formality('boots', 'formal'),
    r.formality('boots', 'informal'),
    r.tone('boots', 'warm'),

    // in lieu of negation, list all valid combinations (!)
    r.colors_2('white', 'gray'),
    r.colors_2('gray', 'tan'),
    r.colors_2('tan', 'brown'),
    r.colors_2('brown', 'black'),
    ({ lhs, rhs }) => [
        r.colors(lhs, rhs),
        r.colors_2(lhs, rhs),
    ],
    ({ lhs, middle, rhs }) => [
        r.colors(lhs, rhs),
        r.colors_2(lhs, middle),
        r.colors(middle, rhs),
    ],

    ({ shirt, pants, shoes }) => [
        r.outfit(shirt, pants, shoes),
        r.position(shirt, 'shirt'),
        r.position(pants, 'pants'),
        r.position(shoes, 'shoes'),
        r.formal_coord(shirt, pants, shoes),
        r.color_coord(shirt, pants),
        r.shoe_coord(pants, shoes),
    ],
    ({ shirt, pants, shoes, formality }) => [
        r.formal_coord(shirt, pants, shoes),
        r.formality(shirt, formality),
        r.formality(pants, formality),
        r.formality(shoes, formality),
    ],
    ({ shirt, pants, color1, color2 }) => [
        r.color_coord(shirt, pants),
        r.color(shirt, color1),
        r.color(pants, color2),
        r.colors(color1, color2),
    ],
    ({ shirt, pants, color1, color2 }) => [
        r.color_coord(shirt, pants),
        r.color(shirt, color1),
        r.color(pants, color2),
        r.colors(color2, color1),
    ],
    ({ pants, shoes, tone }) => [
        r.shoe_coord(pants, shoes),
        r.tone(pants, tone),
        r.tone(shoes, tone),
    ],
]

function getByPosition (position) {
    const res = query(db, ({ id, src }) => [
        r.position(id, position),
        r.preview_src(id, src),
    ])
    return [...res]
}

export const shirts = getByPosition('shirt')
export const pants = getByPosition('pants')

export function getMatch (shirt, pants) {
    const res = query(db, ({ shoes, shirtImg, pantsImg, shoesImg }) => [
        r.outfit(shirt, pants, shoes),
        r.wearing_src(shirt, shirtImg),
        r.wearing_src(pants, pantsImg),
        r.wearing_src(shoes, shoesImg),
    ])
    return [...res][0]
}
