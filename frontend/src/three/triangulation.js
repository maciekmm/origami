import * as earcut from 'earcut'

export function triangulate(vertices, verticeIds) {
    if (verticeIds.length == 3) return [verticeIds];

    let local_idxs = []
    if (verticeIds.length == 4) {
        local_idxs = [
            [0, 1, 2],
            [0, 2, 3]
        ]
    } else {
        const triangulated = earcut.default(vertices, null, 3)
        for (let i = 0; i < triangulated.length; i += 3) {
            local_idxs.push([triangulated[i], triangulated[i + 1], triangulated[i + 2]].sort())
        }
    }

    return local_idxs.map(local_idxs =>
        local_idxs.map(local_id => verticeIds[local_id])
    )
}