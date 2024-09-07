export default (obj) => {
    if (obj.constructor.name === "Array") {
        obj = obj.map((val) => {
            return {
                ...val.toJSON(),
                _id: val._id,
                __v: undefined
            };
        })
        return obj
    }
    return {
        ...obj.toJSON(),
        _id: obj._id,
        // _id: undefined,
        __v: undefined
    };
}