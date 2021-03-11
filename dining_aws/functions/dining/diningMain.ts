import createNote from './createNote';
import deleteNote from './deleteNote';
// import getNoteById from './getNoteById';
import listNotes from './listNotes';
import updateNote from './updateNote';
import {Cusine, Person, Restaurant, Review,} from './types';

type AppSyncEvent = {
    info: {
      fieldName: string, 

   },
    arguments: {
        
        assId:String,
        cusineList:String,
        restaurantId: String,
        addPer: Person,
        addRev: Review,
        addCus: Cusine,
        addREst: Restaurant,
        personId: String,


   },

 }
 exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
              case "friends":
            return await friends();
        case "listNotes":
            return await listNotes();
        case "deleteNote":
            return await deleteNote(event.arguments.noteId);
        case "updateNote":
            return await updateNote(event.arguments.note);
        default:
            return null;
    }
}
