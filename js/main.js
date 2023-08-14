// zoom limits
var minZoomDistance = 7;
var maxZoomDistance = 15;

// onload function
window.onload = function () {
    var canvas1 = document.getElementById("canvas1");
    var engine1 = new BABYLON.Engine(canvas1, true);
    var scene1 = createScene(engine1, canvas1, "models/net.glb");


    engine1.runRenderLoop(function () {
        scene1.render();
    });

    window.addEventListener("resize", function () {
        engine1.resize();
    });
}

// create a scene
function createScene(engine, canvas, modelPath) {
    var scene = new BABYLON.Scene(engine);

    // scenecolor
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = minZoomDistance;
    camera.upperRadiusLimit = maxZoomDistance;

    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.6;

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-1, -1, 0), scene);
    light2.position = new BABYLON.Vector3(20, 40, -20);

    // Model Load
    BABYLON.SceneLoader.ImportMesh("", modelPath, "", scene, function (meshes) {
        // events when model loading
        var mesh = meshes[0];
        var boundingInfo = mesh.getBoundingInfo();
        var center = boundingInfo.boundingBox.center;
        mesh.position = new BABYLON.Vector3(-center.x, -center.y, -center.z);

        // material optimization
        var material = new BABYLON.StandardMaterial("material", scene);
        mesh.material = material;

        // rotation animation
        var animation = new BABYLON.Animation("rotationAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 30,
            value: 2 * Math.PI
        });
        animation.setKeys(keys);
        mesh.animations.push(animation);

        scene.registerBeforeRender(function () {
            mesh.rotate(BABYLON.Axis.Y, 0.001, BABYLON.Space.LOCAL);
        });
    });

    // Render optimization
    engine.runRenderLoop(function () {
        scene.render();
    });

    return scene;
}