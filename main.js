let model;

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            let dataURL = reader.result;
            $("#imagePreview").attr("src", dataURL);
            $("#txtPredict").text("");
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imageUpload").change(function () {
    readURL(this);
});

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}
$("#btnPredict").click(function () {
    $("#txtPredict").text("Analyzing...");
    let image = $("#imagePreview").get(0);
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims();
    (async function () {
        if (!model) {
            model = await tf.loadLayersModel("/transfer/model.json");
            console.log(model)
        }
        let predictions = await model.predict(tensor);
        predictions.print();
        let animal = "Cat";
        if (predictions.dataSync()[0].toFixed() > 0.5) {
            animal = "Dog";
        }
        
        // console.log(tmp)
        await delay(4000);
        $("#txtPredict").text("Hello " + animal);
    })();
})