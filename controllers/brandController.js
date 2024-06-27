const { Watch, Brand } = require('../models/allModel')

class brandController {
    async getAllBrand(req, res) {
        try {
            const brands = await Brand.find({})
            res.status(200).json(brands)
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async deleteBrand(req, res) {
        try {
            const findBrand = await Brand.findById(req.params.id)
            if (!findBrand) {
                return res.json({ message: 'Brand not found' })
            }
            const watchWithBrand = await Watch.findOne({ brand: req.params.id })
            if(watchWithBrand) {
                return res.json({ message: 'This brand is used in a watch' })
            }
            await Brand.findByIdAndDelete(req.params.id)
            res.json({ message: 'Brand deleted successfully' })
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async createBrand(req, res) {
        try {
            const { brandName } = req.body;
            if (!brandName) {
                return res.json({ message: 'Brand name is required' })
            }
            const existsBrand = await Brand.findOne({ brandName: brandName })
            if (existsBrand) {
                return res.json({ message: 'Brand name already exists' })
            }
            const newBrand = new Brand({
                brandName
            })
            await newBrand.save();
            res.json({ message: 'Brand created successfully' })
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async updateBrand(req, res) {
        try {
            const { brandName } = req.body;
            if (!brandName) {
                return res.json({ message: 'Brand name is required' })
            }
            const existsBrand = await Brand.findOne({ brandName: brandName })
            if (existsBrand) {
                return res.json({ message: 'Brand name already exists' })
            }
            const findBrand = await Brand.findByIdAndUpdate(req.params.id, { brandName })
            if (!findBrand) {
                return res.json({ message: 'Brand not found' })
            }
            res.json({ message: 'Brand updated successfully' })
        } catch (error) {
            res.json({ message: error.message })
        }
    }
}

module.exports = new brandController()