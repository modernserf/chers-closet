export function * query (db, fn) {
    const { vars, where } = runClause(fn)
    const bindings = {}
    yield * innerQuery(bindings, db, vars, where)
}

function * innerQuery (bindings, db, vars, where) {
    const [w, ...rest] = where
    for (const rule of db) {
        const iter = Array.isArray(rule)
            ? getFactBindings(bindings, rule, w)
            : getRuleBindings(bindings, rule, w, db)

        for (const nextBindings of iter) {
            if (rest.length) {
                // more rules to match
                yield * innerQuery(nextBindings, db, vars, rest)
            } else {
                // finished matching
                yield mapVars(vars, nextBindings)
            }
        }
    }
}

function runClause (fn) {
    const vars = new Proxy({}, {
        get: (target, name) => {
            if (!target[name]) { target[name] = Symbol(name) }
            return target[name]
        },
    })

    const where = fn(vars)
    return { vars, where }
}

function mapVars (vars, bindings) {
    return Object.keys(vars).reduce((m, k) => {
        m[k] = lookup(bindings, vars[k])
        return m
    }, {})
}

function * getRuleBindings (initBindings, rule, w, db) {
    const { where: [clauseRule, ...clauseConditions], vars: clauseVars } = runClause(rule)
    let bindings = initBindings
    // if rule matches where pattern
    for (let i = 0; i < w.length; i++) {
        bindings = unify(bindings, w[i], clauseRule[i])
        if (!bindings) { return }
    }
    for (const res of innerQuery(bindings, db, clauseVars, clauseConditions)) {
        const fact = rule(res)[0]
        const nextBindings = [...getFactBindings(bindings, fact, w)][0]
        if (nextBindings) { yield nextBindings }
    }
}

function sym (v) { return typeof v === 'symbol' }
function set (l, k, v) { return Object.assign({}, l, {[k]: v}) }

// recursively trace bindings
function lookup (bindings, v) {
    if (!bindings[v]) { return v }
    return lookup(bindings, bindings[v])
}

function unify (bindings, lhs, rhs) {
    lhs = lookup(bindings, lhs)
    rhs = lookup(bindings, rhs)

    // literal equality
    if (lhs === rhs) { return bindings }
    // new binding
    if (sym(lhs)) { return set(bindings, lhs, rhs) }
    if (sym(rhs)) { return set(bindings, rhs, lhs) }
    // mismatch
    return null
}

function * getFactBindings (initBindings, fact, where) {
    let bindings = initBindings
    for (let i = 0; i < where.length; i++) {
        bindings = unify(bindings, where[i], fact[i])
        if (!bindings) { return }
    }
    yield bindings
}

export function createDatabase (tables) {
    const rules = []
    for (const tableName in tables) {
        const table = tables[tableName]
        for (const row of table) {
            const id = row.id
            if (!id) { throw new Error('Row must have `id` field') }
            for (const key in row) {
                if (key === 'id') { continue }
                rules.push([id, `${tableName}/${key}`, row[key]])
            }
        }
    }
    return rules
}

export const r = new Proxy({}, {
    get: (_, name) => (id, ...params) => [id, name, ...params],
})
