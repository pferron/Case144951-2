# Integration test static data

## Video Creation

### Generating Video ID for [Video Playback IT](/packages/planner-event-hubs-ui/tests/it/video.graphql.test.ts)

1. Enable Video 2.0 from CVII and login to Core
2. Create/open an event
3. Create a session
4. Setup “Video Settings” tab as follows:

    - Pre-recorded
    - Available as an on-demand video
    - Upload a video file

5. Save “Video Settings” tab
6. Copy Video ID (Guid) from Video Player Details section (it may take some time for Video ID to be generated by the system)
7. Use generated Video ID to validate expected graph playback video/rendition response