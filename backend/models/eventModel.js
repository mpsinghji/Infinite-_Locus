import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
    title : {type:String , required:true},
    description : {type:String , required:true},
    date : {type:Date , required:true},
    location : {type:String , required:true},
    startTime:{type:time , required:true},
    endTime:{type:time , required:true},
    createdAt : {type:Date , default:Date.now},
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
});
export default mongoose.model('Event', eventSchema);