"user strict"
const output = {
    test : ( req,res )=>{
    },
    chat : (req,res)=>{
    },
    home : (req, res) => {
        res.render("index");
    },
    logout: (req,res) => {
        console.log("output.logout");
    },
    login : (req, res) => {
        console.log( "output.login" );
    },
    register : ( req, res) => {
        console.log( "output.register" );
    }
}

const process = {
    home: (req,res)=>{
        console.log("process.home");
    },
    login: async(req, res) => {
    },
    register: async( req, res) => {
    },

}

module.exports = {
    output,
    process,
};