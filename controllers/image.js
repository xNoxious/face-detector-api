const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.API_KEY_CLARIFAI);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            if (response.outputs[0].data.regions) {
                res.json(response.outputs[0].data.regions);
            }
            else {
                return res.status(400).json('Unsuccessful Request: Your image has no faces or clarifai API face-detect model is down');
            }

        }
    );
}

const handleImageCount = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.status(200).json(entries[0].entries);
        })
        .catch(() => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleApiCall,
    handleImageCount
};