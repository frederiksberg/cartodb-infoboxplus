import { InfoModel } from "./components/models"
import { InfoController } from "./components/controllers"
import { InfoButtonView } from "./components/views"
import { InfoBoxPlusControl} from "./components/leaflet-control";
import * as L from 'leaflet';

import '../sass/cartodb-infoboxplus.scss'

// Export the control as default.
export default InfoBoxPlusControl;
