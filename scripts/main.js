const scene = new THREE.Scene();

         const canvas = document.querySelector('canvas');
         const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 1000);

         const hLightSkyColor = 0xd4eeff;
         const hLightGroundColor = 0xf5f5f5;
         const hLightIntensity = 1;

         const dLightColor = 0xFFFFFF;
         const dLightIntensity = 1;
         
         const Hlight = new THREE.HemisphereLight(hLightSkyColor, hLightGroundColor, hLightIntensity);
         const Dlight = new THREE.DirectionalLight(dLightColor, dLightIntensity);

         const renderer = new THREE.WebGLRenderer({canvas, alpha: true,});

         let animCameraToNoise = false;

         let step_1 = null;
         let step_2 = null;
         let noice = null;
         

         scene.add(Hlight);
         scene.add(Dlight);
         scene.add(Dlight.target);

         AddObject("/models/NoiseSingle/Noise.gltf", 'noise');
         AddObject("/models/1Step/1/1.gltf", '1step');
         AddObject("/models/2Step/1/1.gltf", '2step');

       

         RendererSettings();
         ResizeOnStart();
         requestAnimationFrame(render);
         renderer.setPixelRatio(window.devicePixelRatio);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////          
    function render(time) {
        if (noice != null && step_1 != null)
            step_1.position.set(0,-7,0);
        if (noice != null && step_2 != null)
            step_2.position.set(0,-17,0);

        if(noice != null){
          noice.rotation.y += 0.003;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
        TWEEN.update(time);
    }
    
    document.body.addEventListener('keypress', function(e){
       if(e.code == "KeyM"){
           anim(camera, 2.1, 0, 10, 1000);
       } 
    });
    
    function anim(Obj, X,Y,Z, Time){
        let coords = {x: Obj.position.x, y: Obj.position.y, z: Obj.position.z} // Start at (0, 0)
    let tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
	.to({x: X, y: Y, z: Z}, Time) // Move to (300, 200) in 1 second.
	.easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
	.onUpdate(() => {
        Obj.position.set(coords.x, coords.y, coords.z);

	})
	.start() // Start the tween immediately.

    }
        

// FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS
//#region FUNCTIONS
        function AddObject(Url, Name){
            const gltfLoader = new THREE.GLTFLoader();
            const url = Url;
            gltfLoader.load(url, (gltf) => {
            let root = gltf.scene;
            scene.add(root);

            switch(Name){
              case "noise":   
                noice = root;
              break;
              case "1step":   
                step_1 = root;
              break;
              case "2step":   
                step_2 = root;
              break;
             }
        });
        }

     

        function RendererSettings(){
            renderer.setClearColor(0x000000, 0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.insertBefore(renderer.domElement, document.body.firstChild);
        }
        function ResizeOnStart(){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
            renderer.setSize(width, height, false);
            }
            return needResize;
        }


        document.body.onresize = function(){
            RendererSettings();
            ResizeOnStart(); 
        };
        let timeout = setTimeout(function(){
            noice.add(step_1);
            noice.add(step_2);
            camera.position.set(2.5,-5,12);
            Dlight.position.set(5,10,2);
        },2000);
  