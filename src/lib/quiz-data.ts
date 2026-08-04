export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'drag_drop' | 'cli_simulation' | 'topology_debug';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface ModuleQuiz {
  moduleNumber: number;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

// Sample quiz data for Module 1
export const moduleQuizzes: Record<number, ModuleQuiz> = {
  1: {
    moduleNumber: 1,
    title: 'Network Fundamentals Quiz',
    passingScore: 80,
    questions: [
      {
        id: 'm1-q1',
        type: 'multiple_choice',
        question: 'Which OSI layer is responsible for routing packets between networks?',
        options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport'],
        correctAnswer: 'Layer 3 - Network',
        explanation: 'Layer 3 (Network layer) is responsible for logical addressing and routing packets between different networks. Routers operate at this layer.',
        points: 10,
      },
      {
        id: 'm1-q2',
        type: 'multiple_choice',
        question: 'What is the default subnet mask for a Class C IP address?',
        options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
        correctAnswer: '255.255.255.0',
        explanation: 'Class C addresses use /24 (255.255.255.0) as their default subnet mask, providing 254 usable host addresses.',
        points: 10,
      },
      {
        id: 'm1-q3',
        type: 'multiple_choice',
        question: 'Which protocol uses port 443?',
        options: ['HTTP', 'HTTPS', 'FTP', 'SSH'],
        correctAnswer: 'HTTPS',
        explanation: 'HTTPS (HTTP Secure) uses port 443 for encrypted web traffic. HTTP uses port 80.',
        points: 10,
      },
      {
        id: 'm1-q4',
        type: 'multiple_choice',
        question: 'How many bits are in an IPv4 address?',
        options: ['32 bits', '64 bits', '128 bits', '256 bits'],
        correctAnswer: '32 bits',
        explanation: 'IPv4 addresses are 32 bits long, typically written as four octets (e.g., 192.168.1.1). IPv6 uses 128 bits.',
        points: 10,
      },
      {
        id: 'm1-q5',
        type: 'multiple_choice',
        question: 'What does ARP stand for?',
        options: ['Address Resolution Protocol', 'Automatic Routing Protocol', 'Advanced Resource Protocol', 'Address Routing Process'],
        correctAnswer: 'Address Resolution Protocol',
        explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network segment.',
        points: 10,
      },
      {
        id: 'm1-q6',
        type: 'multiple_choice',
        question: 'Which TCP flag is used to initiate a connection?',
        options: ['ACK', 'FIN', 'SYN', 'RST'],
        correctAnswer: 'SYN',
        explanation: 'The SYN (Synchronize) flag is used in the first step of the TCP three-way handshake to initiate a connection.',
        points: 10,
      },
      {
        id: 'm1-q7',
        type: 'multiple_choice',
        question: 'What is the private IP range for Class A?',
        options: ['10.0.0.0 - 10.255.255.255', '172.16.0.0 - 172.31.255.255', '192.168.0.0 - 192.168.255.255', '169.254.0.0 - 169.254.255.255'],
        correctAnswer: '10.0.0.0 - 10.255.255.255',
        explanation: 'The Class A private range is 10.0.0.0/8 (10.0.0.0 to 10.255.255.255). 172.16.0.0/12 is Class B private, 192.168.0.0/16 is Class C private.',
        points: 10,
      },
      {
        id: 'm1-q8',
        type: 'multiple_choice',
        question: 'Which command shows the IP configuration on a Cisco router?',
        options: ['show interfaces', 'show ip route', 'show running-config', 'show ip interface brief'],
        correctAnswer: 'show ip interface brief',
        explanation: '"show ip interface brief" displays a summary of all interfaces with their IP addresses, status, and protocol state.',
        points: 10,
      },
      {
        id: 'm1-q9',
        type: 'multiple_choice',
        question: 'What is the purpose of DNS?',
        options: ['Assign IP addresses automatically', 'Resolve domain names to IP addresses', 'Encrypt network traffic', 'Route packets between networks'],
        correctAnswer: 'Resolve domain names to IP addresses',
        explanation: 'DNS (Domain Name System) translates human-readable domain names (like google.com) into IP addresses that computers use to communicate.',
        points: 10,
      },
      {
        id: 'm1-q10',
        type: 'multiple_choice',
        question: 'Which OSI layer deals with MAC addresses?',
        options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport'],
        correctAnswer: 'Layer 2 - Data Link',
        explanation: 'Layer 2 (Data Link layer) uses MAC addresses for local network communication. Switches operate at this layer.',
        points: 10,
      },
      {
        id: 'm1-q11',
        type: 'multiple_choice',
        question: 'How many usable hosts are in a /26 subnet?',
        options: ['30', '62', '126', '254'],
        correctAnswer: '62',
        explanation: 'A /26 subnet has 64 total addresses (2^6), minus 2 for network and broadcast = 62 usable hosts.',
        points: 10,
      },
      {
        id: 'm1-q12',
        type: 'multiple_choice',
        question: 'What is the loopback address in IPv4?',
        options: ['0.0.0.0', '127.0.0.1', '255.255.255.255', '192.168.0.1'],
        correctAnswer: '127.0.0.1',
        explanation: '127.0.0.1 is the IPv4 loopback address used to test the local TCP/IP stack. The entire 127.0.0.0/8 range is reserved for loopback.',
        points: 10,
      },
      {
        id: 'm1-q13',
        type: 'multiple_choice',
        question: 'Which protocol is connectionless?',
        options: ['TCP', 'UDP', 'Both', 'Neither'],
        correctAnswer: 'UDP',
        explanation: 'UDP (User Datagram Protocol) is connectionless - it sends data without establishing a connection first. TCP is connection-oriented.',
        points: 10,
      },
      {
        id: 'm1-q14',
        type: 'multiple_choice',
        question: 'What does CIDR notation /24 represent?',
        options: ['24 bits for host', '24 bits for network', '24 total bits', '24 available addresses'],
        correctAnswer: '24 bits for network',
        explanation: 'CIDR /24 means the first 24 bits are the network portion, leaving 8 bits for host addresses (254 usable hosts).',
        points: 10,
      },
      {
        id: 'm1-q15',
        type: 'multiple_choice',
        question: 'Which mode in Cisco CLI allows configuration changes?',
        options: ['User EXEC mode', 'Privileged EXEC mode', 'Global Configuration mode', 'ROM Monitor mode'],
        correctAnswer: 'Global Configuration mode',
        explanation: 'Global Configuration mode (accessed via "configure terminal" from Privileged EXEC) allows you to make changes to the running configuration.',
        points: 10,
      },
    ],
  },
};

export function getQuizByModule(moduleNumber: number): ModuleQuiz | undefined {
  return moduleQuizzes[moduleNumber];
}

export function calculateScore(answers: Record<string, string>, quiz: ModuleQuiz): {
  score: number;
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  points: number;
} {
  let correct = 0;
  let points = 0;
  let streak = 0;

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      correct++;
      streak++;
      points += question.points;
      // Streak bonus
      if (streak >= 3) {
        points += 5;
      }
    } else {
      streak = 0;
    }
  }

  const total = quiz.questions.length;
  const percentage = Math.round((correct / total) * 100);

  return {
    score: percentage,
    correct,
    total,
    percentage,
    passed: percentage >= quiz.passingScore,
    points,
  };
}
