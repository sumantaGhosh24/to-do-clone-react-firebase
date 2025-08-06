import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {faker} from "@faker-js/faker";

import {db} from "./firebase/firebase";

export const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    const userId = "RmTvUMkDLUCi7diQirYDAwjRFZC7";

    console.log("Seeding labels...");
    const labels = [];
    const labelsName = ["Important", "Work", "Personal", "Project", "Delayed"];
    for (let i = 0; i < 5; i++) {
      const label = await addDoc(collection(db, "labels"), {
        title: labelsName[i],
        description: faker.lorem.paragraphs(2),
        color: "#000000",
        user: userId,
        timestamp: serverTimestamp(),
      });
      labels.push(label);
    }
    console.log("Seeded labels.");

    console.log("Seeding projects...");
    const projects = [];
    for (let i = 0; i < 5; i++) {
      const randomLabel = faker.helpers.arrayElement(labels);

      const project = await addDoc(collection(db, "projects"), {
        title: faker.lorem.paragraph(),
        description: faker.lorem.paragraphs(2),
        color: "#000000",
        label: randomLabel.id,
        favorite: i % 2 === 0 ? true : false,
        user: userId,
        timestamp: serverTimestamp(),
      });
      projects.push(project);
    }
    console.log("Seeded projects.");

    console.log("Seeding tasks...");
    const tasks = [];
    for (let i = 0; i < 25; i++) {
      const randomProject = faker.helpers.arrayElement(projects);

      const task = await addDoc(collection(db, "tasks"), {
        title: faker.lorem.paragraph(),
        description: faker.lorem.paragraphs(2),
        projectId: randomProject.id,
        user: userId,
        timestamp: serverTimestamp(),
      });
      tasks.push(task);
    }
    console.log("Seeded tasks.");

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};
