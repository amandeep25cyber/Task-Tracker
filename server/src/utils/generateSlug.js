import slugify from "slugify"
import { nanoid } from "nanoid"

const generateSlug = (name) =>{
    return `${slugify(name,{
        lower:true,
        strict:true
    })}-${nanoid(6)}`;
}

export {
    generateSlug,
}