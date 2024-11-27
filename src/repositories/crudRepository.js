// Created a method to handle CRUD operations for a given schema model 

export default function crudRepository(model) {
    return {
        create: async function (data) {
            const newDoc = await model.create(data);
            return newDoc;
        },
        getAll: async function () {
            const allDocs = await model.find();
            return allDocs;
        },
        getById: async function (id) {
            const doc = await model.findById(id);
            return doc;
        },
        delete: async function (id) {
            const reponse = await model.findByIdAndDelete(id);
            return reponse;
        },
        update: async function (id, data) {
            const updatedDoc = await model.findByIdAndUpdate(id, data, { new: true });
            return updatedDoc;
        }
    }
}