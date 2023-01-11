// Importing node.js file system module
const fs = require('fs')
 
class Repository {
  constructor(filename) {
 
    // Filename where data are going to store
    if(!filename) {
      throw new Error(
'Filename is required to create a datastore!')
    }
 
    this.filename = filename
 
    try {
      fs.accessSync(this.filename)
    } catch(err) {
 
      // If file not exist it is created
      // with empty array
      fs.writeFileSync(this.filename, '[]')
    }
  }
 
  // Get all existing records
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding : 'utf8'
      })
    )
  }
   
  // Create new record
  async create(attrs){
    // Fetch all existing records
    const records = await this.getAll()
 
    // All the existing records with new
    // record push back to database
    records.push(attrs)
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)  
    )
    return attrs
  }
}
 
// The 'datastore.json' file created at runtime
// and all the information provided via signup form
// store in this file in JSON format.
module.exports = new Repository('datastore.json')
