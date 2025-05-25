# Cricket Live Scorer 🏏

A professional cricket scoring system built with HTML, CSS, and JavaScript. This application provides real-time cricket match scoring with comprehensive statistics tracking, scorecard generation, and match management features.

## Features

### Match Setup
- **Team Configuration**: Set up two teams with customizable names
- **Toss Management**: Record toss winner and batting/bowling choice
- **Match Settings**: Configure overs per innings (1-50) and players per team (1-15)
- **Flexible Format**: Supports various cricket formats (T20, ODI, Test matches)

### Live Scoring
- **Ball-by-Ball Scoring**: Track every delivery with runs (0-6) and wickets
- **Real-time Statistics**: Live updates of scores, wickets, overs, and strike rates
- **Player Management**: Add batsmen and bowlers dynamically during the match
- **Strike Rotation**: Automatic strike rotation based on runs scored
- **Over Management**: Complete over tracking with ball-by-ball visualization

### Player Statistics
- **Batsman Stats**: Runs, balls faced, strike rate, boundaries (4s/6s), dot balls
- **Bowler Stats**: Overs bowled, runs conceded, wickets taken, economy rate
- **Visual Indicators**: Color-coded ball tracking and striker highlighting

### Match Management
- **Two Innings Support**: Complete first and second innings tracking
- **Target Calculation**: Automatic target setting for second innings
- **Match End Detection**: Smart detection of match completion conditions
- **Undo Functionality**: Reverse the last ball if needed

### Scorecard & Reports
- **Detailed Scorecard**: Comprehensive batting and bowling statistics
- **Match Summary**: Final scores, winner determination, and match details
- **Export Options**: PDF export functionality (extensible)

## How to Use

### 1. Match Setup
1. Enter team names for both teams
2. Select the toss winner from the dropdown
3. Choose whether the toss winner wants to bat or bowl first
4. Set the number of overs per innings (default: 20)
5. Set the number of players per team (default: 11)
6. Click "Start Match" to begin

### 2. Adding Players
1. **Batsmen**: Enter batsman names and click "Add" to save them
2. **Bowler**: Enter the current bowler's name and click "Add"
3. Players must be added before scoring can begin

### 3. Scoring
- **Runs**: Click buttons 0-6 to record runs scored
- **Wickets**: Click "WICKET" to record a dismissal
- **Strike Rotation**: Odd runs automatically change the striker
- **Over Completion**: Use "Complete Over" or automatic completion after 6 balls

### 4. Match Controls
- **Complete Over**: Manually end the current over
- **End Innings**: Move to the second innings or end the match
- **Scorecard**: View detailed match statistics
- **Undo**: Reverse the last ball bowled

## Technical Specifications

### Browser Compatibility
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop and mobile devices
- No external dependencies required

### File Structure
```
cricket-scorer/
├── index.html          # Main application file
├── README.md          # Documentation
└── assets/            # Optional: images, additional styles
```

### Key Technologies
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Responsive design with Flexbox and Grid
- **Vanilla JavaScript**: No external libraries required
- **Local Storage**: Session-based data management

## Game Rules Implemented

### Scoring Rules
- Runs: 0, 1, 2, 3, 4, 5, 6 per ball
- Boundaries: 4 (boundary) and 6 (over boundary)
- Wickets: Dismissals tracked per team
- Overs: 6 balls per over with automatic completion

### Match Completion Conditions
- All overs completed
- All wickets taken (players - 1)
- Target achieved (second innings)
- Manual innings end

### Statistics Calculations
- **Strike Rate**: (Runs / Balls) × 100
- **Economy Rate**: Runs per over
- **Bowling Average**: Runs per wicket

## Customization Options

### Match Formats
- **T20**: 20 overs per innings
- **ODI**: 50 overs per innings
- **Custom**: Any number of overs (1-50)

### Team Sizes
- Standard: 11 players per team
- Custom: 1-15 players per team

### Visual Themes
- Modern gradient design
- Responsive color coding
- Professional cricket aesthetics

## Installation & Setup

### Quick Start
1. Download the HTML file
2. Open in any modern web browser
3. No additional setup required

### Local Development
1. Clone or download the project
2. Open `index.html` in a web browser
3. Start scoring your cricket match

### Web Hosting
1. Upload the HTML file to any web server
2. Access via web browser
3. Share the URL for remote access

## Advanced Features

### Data Export
- Scorecard generation
- PDF export capability (extensible)
- Match summary reports

### Statistics Tracking
- Ball-by-ball commentary
- Player performance metrics
- Match progression analysis

### Mobile Optimization
- Touch-friendly interface
- Responsive design
- Portrait/landscape support

## Troubleshooting

### Common Issues
1. **Players not saving**: Ensure names are entered before clicking "Add"
2. **Scoring not working**: Add batsmen and bowler before scoring
3. **Over not completing**: Check if 6 balls have been bowled

### Browser Issues
- Clear browser cache if experiencing issues
- Ensure JavaScript is enabled
- Use latest browser version for best performance

## Future Enhancements

### Planned Features
- Player database management
- Tournament mode
- Advanced statistics
- Live streaming integration
- Mobile app version

### Extension Possibilities
- Database integration
- Multi-language support
- Commentary system
- Video highlights integration

## Contributing

This is a standalone application perfect for:
- Cricket clubs and teams
- School and college matches
- Casual game tracking
- Learning cricket scoring

## License

This project is open source and available for educational and personal use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the feature documentation
3. Test in a different browser

---

**Enjoy scoring your cricket matches!** 🏆

*Built with passion for cricket and modern web technologies.*
