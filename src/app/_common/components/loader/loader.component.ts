import { Component } from '@angular/core';

@Component({
  selector: 'loader',
  template: `
    <div class="loader d-flex justify-content-center align-items-center">
      <div class="loadingoverlay">
        <div
          class="loadingoverlay_element"
          style="order: 1; box-sizing: border-box; overflow: visible; flex: 0 0 auto; display: flex; justify-content: center; align-items: center; animation-name: loadingoverlay_animation__rotate_right; animation-duration: 2000ms; animation-timing-function: linear; animation-iteration-count: infinite; width: 120px; height: 120px;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
            <circle
              r="80"
              cx="500"
              cy="90"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="500"
              cy="910"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="90"
              cy="500"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="910"
              cy="500"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="212"
              cy="212"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="788"
              cy="212"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="212"
              cy="788"
              style="fill: rgb(32, 32, 32);"
            ></circle>
            <circle
              r="80"
              cx="788"
              cy="788"
              style="fill: rgb(32, 32, 32);"
            ></circle>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .loader {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
      }
      .loadingoverlay_element svg {
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
      }

      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
