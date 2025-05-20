// src/app/services/teachable.service.ts
import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class TeachableService {
  private model!: tmImage.CustomMobileNet;
  private webcam!: tmImage.Webcam;
  private maxPredictions!: number;
  private loopActive = false;

  constructor(private session: SessionService) {}

  async init(): Promise<void> {
    if (!this.session.isLoggedIn || this.loopActive) return;

    const URL = 'https://teachablemachine.withgoogle.com/models/3frw53_91/';
    this.model = await tmImage.load(`${URL}model.json`, `${URL}metadata.json`);
    this.maxPredictions = this.model.getTotalClasses();

    const flip = true;
    this.webcam = new tmImage.Webcam(200, 200, flip);
    await this.webcam.setup();
    await this.webcam.play();

    const container = document.getElementById('webcam-container');
    if (container) {
      container.innerHTML = '';
      container.style.display = 'block';
      container.appendChild(this.webcam.canvas);
    }

    this.loopActive = true;
    this.loop();
  }

  private async loop(): Promise<void> {
    this.webcam.update();
    await this.predict();
    if (this.loopActive) {
      window.requestAnimationFrame(() => this.loop());
    }
  }

  private async predict(): Promise<void> {
    const prediction = await this.model.predict(this.webcam.canvas);

    const best = prediction.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    if ((best.className === 'Mobil' || best.className === 'Porra') && best.probability > 0.95) {
      this.session.logout();
      this.loopActive = false;
      this.webcam.stop();

      const alertDiv = document.getElementById('alert');
      if (alertDiv) alertDiv.style.display = 'block';

      const webcamContainer = document.getElementById('webcam-container');
      if (webcamContainer) webcamContainer.style.display = 'none';
    }
  }
}



