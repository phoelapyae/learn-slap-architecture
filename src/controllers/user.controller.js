const register = async (req, res) => {
    console.log('Starting Register ***********');
    
    await res.status(200).json({'error': 'hello'});
}

module.exports = {
    register
}