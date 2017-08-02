import BackgroundJob from 'react-native-background-job';

export function backgroundServiceEvery15mins() {
    const backgroundJob = {
 jobKey: "myJob",
 job: () => console.log("Running in background")
};
 
BackgroundJob.register(backgroundJob);
 
var backgroundSchedule = {
 jobKey: "myJob",
}
 
BackgroundJob.schedule(backgroundSchedule);
}