const { Watch, Brand } = require('../models/allModel')
const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
};
class watchController {
    async getAllWatch(req, res) {
        try {
            const watches = await Watch.find().populate('brand')
            res.status(200).json(watches)
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async getDetail(req, res) {
        try {
            const watch = await Watch.findById(req.params.id).populate('brand').populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'Member'
                }
            });
            res.status(200).json(watch)
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async addWatch(req, res) {
        try {
            const { watchName, image, price, Automatic, watchDescription, brand } = req.body;
            if (!watchName || !image || !price || !watchDescription || !brand) {
                return res.json({ message: 'Watch name, image, price, watch description, and brand are required' });
            }
            const findWatch = await Watch.findOne({ watchName: watchName })
            if (findWatch) {
                return res.json({ message: 'Watch already exists' });
            }

            if (price < 1) {
                return res.json({ message: 'Price must be greater than 0' });
            }
            if (!isValidUrl(image)) {
                return res.json({ message: 'Invalid image URL' });
            }

            const newWatch = new Watch({
                watchName,
                image,
                price,
                Automatic,
                watchDescription,
                brand,
            })

            await newWatch.save();
            res.json({ message: 'Add watch successfully' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async deleteWatch(req, res) {
        try {
            const watch = await Watch.findById(req.params.id)
            if (!watch) {
                return res.json({ message: 'Watch not found' });
            }
            await Watch.findByIdAndDelete(req.params.id)
            res.json({ message: 'Delete watch successfully' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async updateWatch(req, res) {
        try {
            const { id } = req.params;
            const { watchName, image, price, Automatic, watchDescription, brand } = req.body;

            // Validate inputs
            if (!watchName || !image || !price || !watchDescription || !brand) {
                return res.json({ message: 'Watch name, image, price, watch description, and brand are required' });
            }
            // Find and update the watch
            const watch = await Watch.findById(id);
            if (!watch) {
                return res.json({ message: 'Watch not found' });
            }

            watch.watchName = watchName;
            watch.image = image;
            watch.price = price;
            watch.Automatic = Automatic;
            watch.watchDescription = watchDescription;
            watch.brand = brand;

            await watch.save();
            res.json('Updated watch successfully');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message })
        }
    }

    async addNewComment(req, res) {
        try {
            const { content, rating, author } = req.body;
            const watch = await Watch.findById(req.params.id);
            if (!watch) {
                return res.json({ message: 'Watch not found' });
            }
            if (!content) {
                return res.json({ message: 'Content is required' });
            }
            if (!author) {
                return res.json({ message: 'Author is required' });
            }
            watch.comments.push({ content, rating, author });
            await watch.save();
            res.json({ message: 'Comment added successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getComments(req, res) {
        const memberId = req.params.id;
        try {
            const watches = await Watch.find({ 'comments.author': memberId });

            // Extract comments from the watches
            const comments = [];
            watches.forEach(watch => {
                watch.comments.forEach(comment => {
                    if (comment.author.toString() === memberId) {
                        comments.push({
                            content: comment.content,
                            rating: comment.rating,
                            watchName: watch.watchName,
                            watchImage: watch.image,
                        });
                    }
                });
            });
            res.json({ comments });
        } catch {
            res.status(500).send({ message: error.message });
        }
    }
    async updateComment(req, res) {
        const commentId = req.params.id;
        const { content, rating } = req.body;
        try {
            const watch = await Watch.findOne({ "comments._id": commentId });
            if (!watch) {
                return res.status(404).send({ message: "Watch or Comment not found" });
            }

            const comment = watch.comments.id(commentId);
            if (!comment) {
                return res.status(404).send({ message: "Comment not found" });
            }

            if (content) comment.content = content;
            if (rating) comment.rating = rating;

            await watch.save();
            res.json({ message: "Comment updated successfully" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
    async deleteComment(req, res) {
        const commentId = req.params.id;
        try {
            const watch = await Watch.findOne({ "comments._id": commentId });
            if (!watch) {
                return res.status(404).send({ message: "Watch or Comment not found" });
            }
            watch.comments = watch.comments.filter(comment => comment._id.toString() !== commentId);
            await watch.save();
            res.json({ message: "Comment deleted successfully" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    } 
}

module.exports = new watchController()