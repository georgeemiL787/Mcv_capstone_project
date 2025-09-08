## Shell Simulation — ROS Package

This repository contains two ROS packages:

- `custom_msg`: custom message definitions used by the simulation
- `shell_simulation`: a Python/ROS stack for simple perception, planning, and control over CARLA topics

The system expects a CARLA simulator and CARLA ROS bridge (or another source) publishing the following topics:

- `/carla/ego_vehicle/vlp16_1` (`sensor_msgs/PointCloud2`) — LiDAR point cloud
- `/carla/ego_vehicle/odometry` (`nav_msgs/Odometry`)
- `/carla/ego_vehicle/imu` (`sensor_msgs/Imu`)
- `/carla/ego_vehicle/speedometer` (`std_msgs/Float32`)

Data files used by `shell_simulation` are located in `shell_simulation/data/`:

- `trajectory.csv` — global waypoints; optional 4th column (flag) and 5th column (highway flag)
- `traffic_lights_info.csv` — traffic light IDs and xyz
- `centroids.csv` — intersection centroid coordinates

### Requirements

- ROS 1 (recommended: Noetic on Ubuntu 20.04; for Windows, use WSL)
- Python 3 with packages provided via ROS or `rosdep`
- CARLA + ROS bridge (or equivalent publishers for the topics above)

The `shell_simulation/package.xml` declares required ROS dependencies. Python runtime deps are also listed there and resolved via `rosdep`.

### Download and install prerequisites

- CARLA simulator: [carla-simulator/carla](https://github.com/carla-simulator/carla)
- CARLA ROS/ROS2 bridge: [carla-simulator/ros-bridge](https://github.com/carla-simulator/ros-bridge)
- Student Docker environment (required): [swri-robotics/sem-apc-student-docker-environment](https://share.google/g5hPImvbERJ5aB8Qn)
- SEM APC ROS bridge (required): [swri-robotics/sem-apc-ros-bridge](https://share.google/A656WF5UGPIYDsVxc)

Follow the build/run instructions in each repo to install and start CARLA, the CARLA ROS bridge, the student Docker environment, and the SEM APC ROS bridge. Ensure the bridge is running and connected to a CARLA server before launching this package.
- `swri-robotics/sem-apc-ros-bridge`: [link](https://share.google/A656WF5UGPIYDsVxc)

### Build and Run — Catkin Tools

Execute the following in a catkin workspace that contains this repo under `src/`.

1) Initialize catkin workspace
```bash
catkin init
```

2) Configure to use install space
```bash
catkin config --install
```

3) Set any build options
```bash
catkin config --cmake-args -DCMAKE_BUILD_TYPE=RelWithDebInfo -DSETUPTOOLS_DEB_LAYOUT=OFF
```

4) Install all dependencies (from workspace root)
```bash
rosdep update
```
```bash
rosdep install . -q -y --from-paths -i
```

5) Build the workspace into /install
```bash
catkin build
```

6) Source installed environment
```bash
source install/setup.bash
```

7) Run the main launch file
```bash
roslaunch shell_simulation shell_simulation.launch
```

If your setup uses `catkin_make` instead of catkin tools:

```bash
catkin_make
```
```bash
source devel/setup.bash
```
```bash
roslaunch shell_simulation shell_simulation.launch
```

If you also have a CARLA bridge launch, start it before the simulation nodes, e.g.:

```bash
roslaunch carla_shell_bridge main.launch
```

### Configuration


Key parameters exposed by `shell_simulation`:

- `path_tracker_node.py` (see `shell_simulation/launch/path_tracker_controller.launch` and `shell_simulation/launch/shell_simulation.launch`)
  - `segment_size` (int): number of waypoints per published segment (default 50; examples use 40 or 60)
  - `min_waypoints` (int): minimum waypoints to publish (default 10)
  - `offtrack_threshold` (float): off-track distance threshold (default 10.0)
  - `flag_distance_threshold` (float): proximity to flag waypoints (default 15.0)

To change these, either edit the launch file or override at runtime, for example:

```bash
roslaunch shell_simulation shell_simulation.launch path_segment_publisher:="path_tracker_node.py" segment_size:=60 min_waypoints:=10 offtrack_threshold:=10.0
```

Note: the main launch staggers node startup via `launch-prefix` sleeps; you can remove or adjust those delays if needed.

#### Change the vehicle spawn point (CARLA/ROS bridge)

This package does not spawn the ego vehicle; CARLA and its ROS bridge do. To change where the car appears:

- If you run CARLA’s ROS bridge example ego vehicle, edit the bridge’s configuration to set a different spawn point (index or transform). In `ros-bridge`, this is typically done via a YAML/JSON config used by `carla_spawn_objects` (e.g., an objects JSON) or by a `spawn_point` parameter in the launch file. See the bridge repo for examples and details: [carla-simulator/ros-bridge](https://github.com/carla-simulator/ros-bridge).
- After changing the spawn configuration in the ROS bridge, restart the CARLA server and the bridge, then run this package’s launch files.

This repository itself has no YAML governing spawn; all nodes subscribe to CARLA topics (`/carla/ego_vehicle/...`).

When building or setting up the bridge, you may get a YAML config that includes a spawn point entry. Update it like this:

```yaml
# carla bridge config (example)
spawn_point_ego_vehicle: "280.363739,-133.306351,1,0,0,0"  # x,y,z,roll,pitch,yaw
# Use "None" for random spawn;


```

### Package Overview

- `scripts/lidar_node.py`
  - Subscribes to CARLA LiDAR and `/clock`, publishes clustered objects as `MarkerArray` and a `Perception` message on `perception/data`.
  - Uses simple voxel filtering, RANSAC ground removal, DBSCAN clustering, and a basic tracker.

- `scripts/path_tracker_node.py`
  - Loads `data/trajectory.csv` and publishes a sliding window of the global path on `/planner/trajectory/global`.
  - Publishes lane-change flags `/planner/flag/change_lane` and `/planner/flag/highway` based on optional columns in the CSV.

- `scripts/planner_perception_node.py`
  - Reads `traffic_lights_info.csv` and `centroids.csv`.
  - Subscribes to `perception/data` and `/planner/trajectory/global`; republishes consolidated `Perception` on `/planner/perception`.
  - Publishes intersection flags `/planner/flag/intersection` and `/planner/flag/safe_in_intersection`.

- `scripts/behavior_planner_node.py`
  - Consumes `/planner/perception`, `/planner/flag/*`, and odometry/speed topics.
  - Emits a mode string on `/planner/mode` such as `stop:dist`, `follow:speed`, or `proceed`.

- `scripts/controller_node.py`
  - Consumes `/planner/mode`, `/planner/trajectory/global`, odometry, IMU, speedometer.
  - Publishes `/throttle_command`, `/brake_command`, `/steering_command`, `/gear_command`.

### Launch Files

- `launch/shell_simulation.launch`: starts the full stack with startup delays; exposes parameters for path-tracker.
- `launch/path_tracker_controller.launch`: starts only the path tracker and controller with example parameters.
- `launch/test.launch`: small test launch for LiDAR and planner-perception nodes.

### Data File Expectations

- `data/trajectory.csv`
  - Column 1: x, Column 2: y (y is negated internally); optional Column 4: lane-change flag (1 to trigger), optional Column 5: highway flag (1 to enable highway speed mode).

- `data/traffic_lights_info.csv`
  - Columns: id, x, y, z.

- `data/centroids.csv`
  - Columns: `x`, `y` (y is negated internally).

Ensure these files exist and contain values appropriate to your CARLA map.

### Custom Messages

The `custom_msg` package defines:

- `Dimensions.msg`
- `ObjectInfo.msg`
- `Perception.msg`
- `TrafficLightsInfo.msg`

They are built automatically when you build the workspace. Make sure both `custom_msg` and `shell_simulation` are inside the same workspace before building.

### Troubleshooting

- If topics are missing, ensure CARLA and ROS bridge are running and publishing the expected topics.
- On Windows, prefer WSL for ROS (Noetic on Ubuntu 20.04) and run the above commands inside WSL
