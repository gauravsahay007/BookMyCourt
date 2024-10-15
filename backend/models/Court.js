// Define the schema for a Court model
const courtSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Court name is required
    sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }, // Reference to the related Sport model
    availability: [{ 
        date: Date, // Date for availability
        timeSlots: [{
            startTime: String, // Start time for the time slot
            endTime: String, // End time for the time slot
            status: { 
                type: String, 
                enum: ['booked', 'blocked', 'coaching'], // Status of the time slot
                required: true 
            },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the user if booked
            coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to a coach if it's a coaching session
        }]
    }]
});
