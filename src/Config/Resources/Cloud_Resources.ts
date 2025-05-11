import { AWS_Resources } from "./AWS_Resources";
import { Azure_Resources } from "./Azure_Resources";

export const Cloud_Resources = ([].concat(Azure_Resources)).concat(AWS_Resources);