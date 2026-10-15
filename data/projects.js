// All projects shown on projects.html, in display order.
// Add a project: copy a block below. Remove: delete its block. Reorder: move its block.
//
//   title    string
//   tools    string[]                    (optional)
//   skills   string[]                    (optional)
//   media    images: { src, caption, alt? }      -- captions are auto-numbered
//            videos: { type: 'video', src, poster?, caption, mime? }
//   summary  HTML string, always visible
//   details  HTML string, shown on click-to-expand   (optional)
//   links    [{ label, href, icon? }] inside details; icon defaults to GitHub (optional)
const projects = [
    {
        title: 'Pet Rescue Robot',
        tools: ['C++', 'ESP32', 'LiDar Sensors', 'Magnetometer Sensors', 'Servo Motors', 'OnShape'],
        skills: ['Object Oriented Programming', '3D CAD', 'Circuit Design', 'Sensor Characterization', 'Prototyping', 'I2C Protocol', 'UART Protocol'],
        media: [
            { type: 'video', src: '/assets/videos/robotSum/PetRescRobotTwoPet.mp4', poster: '/assets/images/robotSum/PetRescDump.jpeg', caption: 'Robot collecting pets' },
            { src: '/assets/images/robotSum/PetRescSide.jpeg', alt: 'Perspective view of robot', caption: 'Perspective View' },
            { src: '/assets/images/robotSum/claw-v6.png', alt: 'Claw Mount & Claw Part Final Design in OnShape', caption: 'Claw Mount & Claw Part Final Design in OnShape' },
            { src: '/assets/images/robotSum/ArmBase.png', alt: 'Arm Base Servo Mount Design in OnShape', caption: 'Arm Base Servo Mount Design in OnShape' },
            { src: '/assets/images/robotSum/magMount.png', alt: 'Compliant Magnetometer Mount Design in OnShape', caption: 'Compliant Magnetometer Mount Design in OnShape' },
            { src: '/assets/images/robotSum/servoPower.jpg', alt: 'Servo power diagram', caption: 'Servo Power Diagram' },
            { src: '/assets/images/robotSum/magnetometer.png', alt: 'Magnetometer diagram', caption: 'Magnetometer Functional Overview' },
            { src: '/assets/images/robotSum/PetRescDump.jpeg', alt: 'Robot collecting pet', caption: 'Robot Collecting Pet' },
            { src: '/assets/images/robotSum/PetRescSide2.jpeg', alt: 'Side view of robot', caption: 'Side View' },
        ],
        summary: `
            As part of a team of four, I designed, built, and competed with an <b>autonomous robot</b> capable
            of seeking out and rescuing small stuffed animals ('pets') from an obstacle-filled environment.
            Our robot placed 2nd of 15 teams in the final course competition.<br><br>

            We integrated a range of hardware and control systems:<br>
            - <b>LiDAR</b> for initial target detection and navigation support<br>
            - <b>Infrared Reflectance Sensor</b> array in a PID feedback loop for line-following navigation<br>
            - Dual <b>Triple-Axis LIS3MDL Magnetometers</b> to guide the robotic claw toward magnetic targets<br>
            - <b>ESP32 Microcontrollers</b> for sensor data processing, control of the robotic arm and claw, and drive control.<br>
            - <b>I2C</b> and <b>UART</b> Protocols for sensor-microcontroller and inter-microcontroller communication respectively<br>
            - Servos, DC motors, and other fundamental drive and control components<br><br>

            The robot was powered by three Lithium-polymer (LiPo) batteries, and its chassis, storage bay, and
            arm were built from laser-cut hardboard and 3D-printed PLA components designed in <b>OnShape</b>.
        `,
        details: `
            <b>Servo Power & Control Circuit</b> (see figure 6)<br>
            PWM signals were sent from the ESP32 Pet Acquisition Controller (PAC) to the servo motors through Optocoupler ICs to isolate the
            ESP32 from the noisy power servo power circuitry. The five servo motors were powered by a LiPo battery through three 6V buck converters;
            because the buck converters were current-limited, the two high-load servo motors at the base of the arm were each fed by their own buck
            converter while the other three servo motors were all served by the same buck converter. The PAC ESP32 was powered by a LiPo battery
            reserved for lower power control and sensing applications.<br><br>

            <b>Claw Design</b><br>
            A teammate and I prototyped the claw and arm assembly; the components I owned were the claw/claw servo mount (figure 3),
            the claw itself, and the magnetometer mount, while I shared ownership of the arm base servo enclosure (figure 4). Using
            OnShape and a 3D printer, I iterated through several designs of the claw, claw and servo mount, and magnetometer mount.
            For quicker print times and less material usage, I initially used a smooth, flat, gripping surface with ridges only on the
            tip of the claw, but it consistenly failed to grip the pets even with significant servo torque. I then acheived consistent
            gripping performance even with poor overall contact area by adding dull, shallow, spikes to the gripping surface of the claw.
            I also transformed the shape from a flat gripping surface to a concave gripping surface to better conform to the shape of
            the pets (see figure 3).<br><br>

            <b>Magnetometer Mount Design</b><br>
            The mount was designed to hold the magnetometer in a consistent position relative to the claw when the system
            was seeking out the magnetic target. To simplify the signal processing associated with the magnetic flux density measurement,
            I designed the mount to hold the magnetometer such that the flux density vector would be aligned with the magnetometer's z-axis
            when the claw was directly above the magnetic target. This simplification in signal interpretation introduced collision between
            the mount and the pet when the claw grasped the pet, which led to brittle material failure at the base of the mount. I
            resolved this by designing compliance into the mount, allowing the mount to yield to the pet when being grasped while returning
            the magnetometer to its original position using a spring once the pet was released, ready to seek out the next magnetic target.
            This compliant mechanism can be seen in the first video in the media scroller and in figure 5.<br><br>

            <b>Pet Acquisition Control</b><br>
            Once a pet was detected near the robot and the robot was positioned close by (controls for this process was owned by a navigation
            controller), command of the robot was handed over to the PAC, which I owned, and the navigation
            controller would serve main drive motor commands requested by the PAC.<br><br>

            Magnetic flux density vectors were sensed by an <a href="https://www.adafruit.com/product/4479">Adafruit LIS3MDL triple-axis
            magnetometer</a> and sent to my controller via I2C. The sign of the readings in the x and y axes were used to determine whether
            the robot needed to drive forward/backward or pivot the arm cw/ccw. The squared magnitude of the magnetic flux density vector
            was used to determine if the claw was close enough to the magnetic target to attempt a grasp. If the threshold squared magnitude
            was not met before a timeout, the PAC would attempt a grasp anyway before moving on to the next pet. This approach was taken due
            to the 2 minute time limit on the run; we did not want to dwell on a single pet for too long and risk not being able to collect
            others for the sake of the one.<br><br>

            Once a pet was grasped, a 'dump' control sequence would deposit the pet in a box on the back of the robot and control would be
            handed back to the main navigation controller.
        `,
    },
    {
        title: 'Bass Guitar Companion',
        tools: ['EasyEDA', 'ESP32'],
        skills: ['Power Systems Design', 'Circuit Design', 'Prototyping', 'I2C Protocol'],
        media: [
            { src: '/assets/images/bassGuitar/fullSys.png', alt: 'Full system schematic', caption: 'Full System Schematic' },
            { src: '/assets/images/bassGuitar/charging.png', alt: 'USB-C-LiPo charging schematic', caption: 'USB-C-LiPo Charging Schematic' },
            { src: '/assets/images/bassGuitar/loadSharing.png', alt: 'Load sharing & power path management schematic', caption: 'Load Sharing & Power Path Management Schematic' },
            { src: '/assets/images/bassGuitar/system.png', alt: 'Control system schematic', caption: 'Control System Schematic' },
            { src: '/assets/images/bassGuitar/bodeAttempt1.png', alt: 'Bass Output Processing Circuit Bode Plot', caption: 'Bass Output Processing Circuit Bode Plot' },
            { src: '/assets/images/bassGuitar/bodeAttempt33.png', alt: '4th-Order vs 2nd-Order Active Bandpass Filter Comparison', caption: '4th-Order vs 2nd-Order Active Bandpass Filter Comparison' },
            { src: '/assets/images/bassGuitar/impdnc_mismatch.png', alt: 'Attenuator -> DC Offset Segment Impedance Mismatch Issue', caption: 'Attenuator -> DC Offset Segment Impedance Mismatch Issue (top circuit has DC Offset segment, bottom does not)' },
            { src: '/assets/images/bassGuitar/buffer_fix.png', alt: 'Buffer to Resolve Impedance Mismatch Between Segments', caption: 'Buffer to Resolve Impedance Mismatch Between Segments (top circuit has buffer, bottom does not)' },
            { src: '/assets/images/bassGuitar/signalCondCircuit.png', alt: 'Signal Conditioning Circuit for Input to ESP32 SAR ADC', caption: 'Signal Conditioning Circuit for Input to ESP32 SAR ADC in LTSpice' },
        ],
        summary: `
            I am designing a companion system centered around an <b>ESP32 microcontroller</b> for my bass guitar that will allow me to control
            basic DAW (Ableton Live) functions remotely and to track playing metrics. I am focusing on <b>power systems design</b> for consumer-safe
            electronics, noisy <b>AC signal processing</b> for coherant interpretation (for a tuner), and <b>PCB design</b>.
        `,
        details: `
            <b>Power System Design</b><br>
            Initial inspiration for load sharing system from <a href="https://ww1.microchip.com/downloads/en/AppNotes/01149a.pdf">this document</a>
            by Brian Chu at Microchip Technology Inc. I replaced the function of the Schottky diode (D1) with the LM66200 ORing Controller
            to reduce power loss and provide a stable voltage rail to the ESP32 microcontroller. I also replaced the P-MOSFET (Q1) used to isolate the
            battery in Brian Chu's design with an N-MOSFET used to enable the boost converter tasked with boosting the battery voltage to a stable 5V.
            With this boost converter disabled, which occurs during charging when the usb-c cable is connected, the battery is isolated from the load
            with redundant back-current protection from the LM66200 ORing controller and the TPS61022 boost converter.<br><br>

            <i>Note: I will revisit the design of this system to power the tuner portion of this project, which I chose to pursue after initially desiging
            this power system.</i><br><br>

            <b>Tuner Design</b><br>
            To permit tuning the bass down to a B0 (30.87Hz), the tuner circuit will be designed for frequencies from 25Hz -> 135Hz where the
            frequency range to which the strings will be tuned is from B0 (30.87Hz) to G2 (98.00Hz). To process the raw bass output for input
            to the ESP32's SAR ADC, I will put it through a band-pass filter to remove noise, attenuate it, and apply a DC offset to ensure
            the signal is within the optimal voltage range for the SAR ADC (100mV - 900mV). To resolve excessive signal attenuation at the boundaries
            of the 25Hz - 135Hz frequency band, I am designing for maximum 5% attenuation at those edge frequencies rather than treating them
            as the filter's cutoff frequencies (with 29.3% attenuation).<br><br>

            I've designed a 4th-order active RC-OpAmp bandpass filter to improve the selectivity of the filter (when compared to passive RC
            or RLC bandpass filters) with fewer components to resolve the gentle roll-off associated with passive RC/RLC bandpass filters.
            See figure 6 for a comparison between a 2nd-order 4th-order active bandpass filter, where we see increased selectivity in the
            4th-order filter with a sharper rolloff.<br><br>

            <b>Current Activity</b>
            I am currently running SPICE simulations to evaluate this signal processing circuit. A buffer was added between the attenuator and DC Offset
            segments to prevent the 3.3V source from raising the output voltage of the attenuator portion, which would then be boosted by another 500mV
            (see figures 7 & 8). As seen in figure 8, I need to resolve behaviour in which there is a sharp voltage spike at startup, as this could damage
            the ESP32's SAR ADC.<br><br>

            PCB design, enclosure design, and assembly will follow once the schematic is complete and tested through simulation.
        `,
    },
    {
        title: 'Simulated Drone Control',
        tools: ['Python', 'OpenCV', 'ROSa', 'Gazebo', 'OnShape', 'GitHub'],
        skills: ['Networking', 'Bash Scripting', 'Drone Control', 'Version Control'],
        media: [
            { src: '/assets/images/enph353/debugWindow.png', alt: 'Navigation debugging view', caption: 'Navigation debugging view' },
            { src: '/assets/images/enph353/rpyControl.png', alt: 'Roll and pitch control flow', caption: 'Roll and pitch control flow' },
            { src: '/assets/images/enph353/flyingDrone.png', alt: 'Drone in simulation', caption: 'Drone in simulation' },
            { src: '/assets/images/enph353/blueMask.png', alt: 'Image processing-blue mask', caption: 'Image processing-blue mask' },
            { src: '/assets/images/enph353/morphology.png', alt: 'Image processing-morphological closing', caption: 'Image processing-morphological closing' },
            { src: '/assets/images/enph353/signHull.png', alt: 'Image processing-contours & convex hull', caption: 'Image processing-contours & convex hull' },
        ],
        summary: `
            I created a two-drone team to <b>navigate a Gazebo-simulated environment</b> to collect data from signs.
            <b>ROS1</b> controller nodes were implemented in <b>Python</b> and communicated via rostopics. For high-frequency
            inter-drone communication I created a custom lightweight message type (see drone message repository). Controllers
            and stabilizers would send movement demands to a command bridge node which would apply all requested forces to the
            drone. This was to isolate ownership of force application to a single node and reduce the number of service calls to
            Gazebo's costly ApplyBodyWrench service.
        `,
        links: [
            { label: 'drone controllers', href: 'https://github.com/nlodder/enph353-drone-controllers' },
            { label: 'drone launcher', href: 'https://github.com/nlodder/enph353-drone-bringup' },
            { label: 'drone definition', href: 'https://github.com/nlodder/enph353-drone-desc' },
            { label: 'drone message', href: 'https://github.com/nlodder/enph353-drone-msgs' },
        ],
        details: `
            <b>Drone Planar Stabilization</b><br>
            Roll and pitch stabilization was handled by a node that took inputs from an IMU link on the drone body and published
            required correction velocities (to be read by the command bridge) after passing the roll, pitch and angular velocity
            values through a PID function.
            <br><br>
            <b>Drone Navigation</b><br>
            The front camera feed was processed with <b>OpenCV</b> for navigation. The difference of the horizontal centroid of blue signs
            from the centre of the frame was used as the error for left/right strafing and yaw PID controllers. For forward/backward
            movement I used the relative height of the sign in the frame, pushing the drone back if the sign was too large in frame,
            and forward if it was too small. This error was also passed through a PID controller to determine the forward/backward
            velocity demand.
            <br><br>
            <b>Drone Design</b><br>
            The base drone design was created in OnShape and converted to a URDF file through the
            <a href="https://onshape-to-robot.readthedocs.io/en/latest/">onshape-to-robot plugin</a>. I wrote a python script to convert
            this <code>.urdf</code> file to a <code>.xacro</code> file for cleanliness and better handling of repeat parts. This file was
            then modified per developed needs in controller development (adding sensors, modifying drone colors, adding ArUco markers etc.).
        `,
    },
    {
        title: 'Wheelchair Backup Assist Proximity Overlay',
        tools: ['Python', 'Raspberry Pi', 'Raspberry Pi OS Linux', 'Ultrasonic Sensors', 'Data Processing'],
        skills: ['Software Construction', 'Command Line Interfacing', 'Sensor Characterization', 'Prototyping'],
        media: [
            { type: 'video', src: '/assets/videos/enable/overallSetupLite.mov', poster: '/assets/images/enable/bannerOverall.jpeg', caption: 'Sensor overlay on camera feed prototype setup' },
            { type: 'video', src: '/assets/videos/enable/ultra.mov', poster: '/assets/images/enable/bannerUltra.jpeg', caption: 'Sensor overlay on camera feed prototype setup' },
            { src: '/assets/images/enable/setup.jpeg', alt: 'Raspberry Pi setup', caption: 'Raspberry Pi and ultrasonic sensors prototyping' },
            { src: '/assets/images/enable/guiOverlay.jpeg', alt: 'GUI overlay', caption: 'Distance data overlay on camera feed' },
        ],
        summary: `
            As part of the Electrical Sub-team at UBC BEST-Enable I programmed Raspberry Pi
            to stream video from a Picam to a small monitor with a proximity-indicator
            overlay to provide client in electric wheelchair with visibility and proximity
            feedback when reversing in tight environments.<br><br>

            This was my first introduction to working on a linux system and debugging
            in the command line where our primary struggle was interfacing with the
            external display to create a clean and effective stream for our client. We
            overcame this by looking through the openCV documentation to find potential
            solutions, landing on the Python OpenCV
            <a href="https://docs.opencv.org/4.x/d7/dfc/group__highgui.html#ga5afdf8410934fd099df85c75b2e0888b">namedWindow()</a>
            method.
        `,
    },
    {
        title: 'Obsidian Interactive Plot Plugin',
        tools: ['CSS', 'JavaScript', 'Python'],
        skills: ['Object-Oriented Programming', 'Event-Driven Architecture', 'Inter-Process Communication', 'Resource Management'],
        media: [
            { type: 'video', src: '/assets/videos/obsidian/vid.mp4', poster: '/assets/images/obsidian/code.png', caption: 'Demo of plugin' },
            { src: '/assets/images/obsidian/plot.png', alt: 'dark mode embedded plot in Obsidian', caption: 'Dark mode interactive plot' },
            { src: '/assets/images/obsidian/plot-light.png', alt: 'light mode embedded plot in Obsidian', caption: 'Light mode interactive plot' },
            { src: '/assets/images/obsidian/code.png', alt: 'code block for plot in Obsidian', caption: 'Code block for plot in Obsidian' },
        ],
        summary: `
            I developed a custom Obsidian plugin that integrates a live Python
            execution environment directly into Markdown notes. Designed to replace
            static hand-drawn plots with interactive data visualizations, the plugin
            uses Node.js child processes to bridge Obsidian with the
            Python/Plotly ecosystem. It features a custom CSS-to-Python theme engine
            that dynamically injects Obsidian's UI variables into the rendering pipeline,
            ensuring that plots automatically adapt their color palettes
            during theme shifts (see photos) for a native user experience.
        `,
        links: [
            { label: 'github repository', href: 'https://github.com/nlodder/local-python-obsidian' },
        ],
        details: `
            I wrote this plugin to improve my knowledge management environment and engineering
            and learning workflows. I plan to create more quality of life features such
            as quick-plot shortcuts and other UI shortcuts (slider, variable manipulators etc.)
            as time permits.<br><br>

            NOTE: There is currently an issue where the plugin does not render regular python code
            blocks properly, only rendering when the tag is <code>python local-py</code>. I am actively working
            on resolving this issue.<br><br>

            NOTE: Development is on hold while I determine whether/how to protect against recent and anticipated
            supply chain vulnerabilities in python dependencies.
        `,
    },
];
