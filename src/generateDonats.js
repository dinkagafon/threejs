import gsap, { Power2 } from 'gsap';
import { CustomEase } from 'gsap/all';
import { Group } from 'three';
gsap.registerPlugin(CustomEase);
export function generateElements(generateElement, count = 60) {
  const group = new Group();
  for (let i = 0; i < 50; i++) {
    const element = generateElement();
    element.position.x = (Math.random() - 0.5) * 10;
    element.position.y = (Math.random() - 0.5) * 10;
    element.position.z = (Math.random() - 0.5) * 10;
    element.rotation.x = Math.random() * Math.PI;
    element.rotation.y = Math.random() * Math.PI;
    group.add(element);
    gsap.to(element.position, {
      x: `random(${element.position.x - 0.1}, ${element.position.x + 0.1})`, //chooses a random number between -20 and 20 for each target, rounding to the closest 5!
      y: `random(${element.position.y - 0.1}, ${element.position.y + 0.1})`,
      z: `random(${element.position.z - 0.1}, ${element.position.z + 0.1})`,
      duration: 3,
      ease: CustomEase.create('custom', 'M0,0 C0.402,0 0.602,1 1,1 '),
      repeat: -1,
      repeatRefresh: true, // gets a new random x and y value on each repeat
    });

    gsap.to(element.rotation, {
      x: `random(0, ${3 * Math.PI})`, //chooses a random number between -20 and 20 for each target, rounding to the closest 5!
      y: `random(0, ${3 * Math.PI})`,
      duration: 20,
      ease: CustomEase.create('custom', 'M0,0 C0.402,0 0.602,1 1,1 '),
      repeat: -1,
      repeatRefresh: true, // gets a new random x and y value on each repeat
    });
  }
  return group;
}
