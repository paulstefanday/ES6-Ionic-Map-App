export default app => {

  app
    .run(($ionicPlatform) => {
      $ionicPlatform.ready(() => {
        if(window.StatusBar) StatusBar.styleDefault();
      });
    });

}