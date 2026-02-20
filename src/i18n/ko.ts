const ko = {
  hero: {
    name: "김재성",
    nameEn: "KIM JAE SUNG",
    subtitle: "PORTFOLIO",
    field: "AI / GAME AI / REINFORCEMENT LEARNING",
  },
  profile: {
    name: "김재성",
    nameEn: "Kim Jae Sung",
    birth: "1998.06.17",
    phone: "010-9978-9504",
    email: "rlawotjd9504@naver.com",
    education: [
      {
        period: "2026.02",
        school: "동국대학교 일반대학원",
        major: "컴퓨터-AI학과, 게임공학 전공",
        degree: "석사 졸업",
      },
    ],
    paper: [
      {
        title:
          "Joint Optimization-Based Texture and Geometry Enhancement Method for Single-Image-Based 3D Content Creation",
      },
      {
        title:
          "농구게임 강화학습을 위한 역할 특화 경험 우선순위 샘플링 연구",
      },
    ],
  },
  about: {
    greeting: "안녕하세요, 김재성입니다.",
    description:
      "저는 게임, 게임 인공지능에 관심이 많으며 강화학습 지능형 에이전트 개발부터 2D to 3D 알고리즘을 활용한 데이터셋 구현까지 핵심 AI 기술을 연구하였습니다. 게임, 시뮬레이션과 같은 가상 환경에서의 지능형 모델링과 데이터 구현 기술을 결합하여 사용자에게 직접적인 체감과 도움이 되는 결과물을 만들고 싶습니다.",
  },
  skills: {
    categories: [
      {
        name: "Reinforcement Learning",
        items: ["PPO", "QMIX", "Q-Learning", "DQN"],
      },
      {
        name: "3D Reconstruction",
        items: ["NeRF", "instant mesh", "Zero 123"],
      },
      {
        name: "Programming",
        items: ["Python", "PyTorch", "CUDA"],
      },
      {
        name: "Development Tools",
        items: ["Linux (Ubuntu)", "Visual Studio Code", "GitHub"],
      },
    ],
  },
  license: {
    items: [
      { name: "TOEIC Speaking IM3" },
      { name: "네트워크관리사 2급" },
      { name: "행정관리사 3급" },
      { name: "2종보통운전면허" },
    ],
  },
  projects: {
    items: [
      {
        id: "joycity",
        title: "프리스타일 게임인공지능 연구개발",
        org: "㈜ 조이시티",
        role: "강화학습 기반 게임 AI 연구개발",
        period: "2024~2025",
        summary: "프리스타일 게임인공지능 연구개발",
        description:
          "프리스타일2 게임 내에서 플레이어와 함께 게임을 진행하며 FSM을 대체 할 수 있는 강화학습 기반의 인공지능 AI를 연구개발 하였습니다. \n 프리스타일2 게임과 동일한 규칙을 가지고 있는 AI 에이전트 명령 인터페이스 시뮬레이터를 기반으로 학습하였습니다.",
        contributions: [
          "강화학습 기반 게임 AI 에이전트 설계",
          "게임 환경 시뮬레이션 구축",
        ],
        results: [
          "성과를 입력해주세요.",
        ],
        stack: ["Reinforcement Learning", "QMIX", "DQN"],
      },
      {
        id: "add",
        title: "군집 학습 / 모의입증 시뮬레이터 구현 (ADD)",
        org: "국방과학연구소 (ADD)",
        role: "멀티에이전트 강화학습 연구개발",
        period: "2024",
        summary: "군집 학습 / 모의입증 시뮬레이터 구현 (ADD)",
        description:
          "다중 에이전트 환경에서의 군집 학습 알고리즘을 연구하고, 모의입증을 위한 시뮬레이션 환경을 구축하였습니다. QMIX 등 멀티에이전트 강화학습 기법을 적용하여 협력적 행동 전략을 학습시켰습니다.",
        contributions: [
          "멀티에이전트 강화학습 파이프라인 구축",
          "모의입증 시뮬레이터 설계 및 구현",
          "군집 행동 전략 최적화",
        ],
        results: [
          "성과를 입력해주세요.",
        ],
        stack: ["NERF", "3D Reconstruction", "Instant Mesh"],
      },
      {
        id: "dongguk",
        title: "딥러닝 알고리즘 기반 3D 에셋 생성 시스템",
        org: "동국대학교",
        role: "3D 재구성 알고리즘 연구개발",
        period: "2024",
        summary: "딥러닝 알고리즘 기반 3D 에셋 생성 시스템",
        description:
          "NeRF 및 3D 재구성 알고리즘을 활용하여 2D 이미지로부터 3D 에셋을 자동 생성하는 시스템을 연구하였습니다. 게임 및 가상 환경에서 활용 가능한 고품질 3D 데이터셋 구축을 목표로 진행하였습니다.",
        contributions: [
          "NeRF 기반 3D 재구성 파이프라인 구현",
          "2D to 3D 변환 알고리즘 연구",
          "3D 에셋 품질 평가 시스템 구축",
        ],
        results: [
          "성과를 입력해주세요.",
        ],
        stack: ["3D reconstruction", "Game", "Unreal", "Instant Mesh"],
      },
    ],
  },
  contact: {
    items: [
      { label: "Name", value: "김재성" },
      { label: "Phone", value: "010-9978-9504" },
      { label: "Email", value: "rlawotjd9504@naver.com" },
      // { label: "SNS", value: "@reallygreatsite" },
    ],
  },
};

export default ko;
