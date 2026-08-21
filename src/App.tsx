import { useState, useEffect, useRef } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SourceEntry {
  type: 'photo' | 'document' | 'interpretation';
  title: string;
  institution: string;
  url?: string;
  date?: string;
  notes?: string;
}

// ─── NAV DATA ────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'boicanh', num: '01', label: 'Bối cảnh' },
  { id: 'vandede', num: '02', label: 'Vấn đề' },
  { id: 'hoinghi', num: '03', label: 'Hội nghị VI–VIII' },
  { id: 'xaydung', num: '04', label: 'Lực lượng' },
  { id: 'tichluy', num: '05', label: '1941–1944' },
  { id: 'buocngoat', num: '06', label: '3/1945' },
  { id: 'thoico', num: '07', label: 'Thời cơ' },
  { id: 'quyetdinh', num: '08', label: 'Quyết định' },
  { id: 'baihoc', num: '09', label: 'Bài học' },
  { id: 'tongket', num: '10', label: 'Tổng kết' },
];

// ─── CONTENT DATA ────────────────────────────────────────────────────────────

const worldEvents = [
  { date: '09/1939', event: 'Chiến tranh thế giới thứ II bùng nổ', impact: 'Trật tự thế giới bị đảo lộn. Các nước thực dân tập trung lực lượng về châu Âu, suy yếu ở thuộc địa.' },
  { date: '06/1940', event: 'Pháp thất bại, ký hiệp định đình chiến với Đức', impact: 'Vị thế của Pháp tại thuộc địa suy sụp nghiêm trọng — mất uy quyền, mất niềm tin.' },
  { date: '09/1940', event: 'Nhật – Đức – Ý ký Hiệp ước Tam cường', impact: 'Phe phát xít bành trướng toàn cầu; Nhật Bản ráo riết mở rộng ảnh hưởng tại châu Á.' },
  { date: '06/1941', event: 'Đức tấn công Liên Xô', impact: 'Cuộc chiến mở ra mặt trận phía Đông quyết định; thế giới đối đầu trực tiếp với chủ nghĩa phát xít.' },
];

const vietnamEvents = [
  { date: '09/1940', event: 'Nhật tiến vào Đông Dương — Pháp buộc nhượng bộ', impact: 'Đông Dương bước vào thời kỳ thống trị kép Pháp–Nhật. Nhân dân bị bóc lột từ hai phía.' },
  { date: '1940–1944', event: 'Pháp tăng cường đàn áp các phong trào yêu nước', impact: 'Hàng nghìn chiến sĩ bị bắt, tù đày, thủ tiêu. Nhiều cơ sở Đảng bị phá vỡ.' },
  { date: '1940–1945', event: 'Nhật và Pháp cùng vơ vét tài nguyên, bóc lột kinh tế', impact: 'Kinh tế kiệt quệ. Nạn đói 1944–1945 cướp đi hơn 2 triệu sinh mạng.' },
  { date: '1940–1941', event: 'Các khởi nghĩa bị đàn áp (Bắc Sơn, Nam Kỳ, Đô Lương)', impact: 'Tổn thất nặng nề nhưng tích lũy kinh nghiệm quý báu về vũ trang và xây dựng lực lượng.' },
];

const conferences = [
  {
    roman: 'VI', date: '11/1939', phase: 'KHỞI ĐẦU',
    fullTitle: 'Hội nghị Trung ương VI',
    thesis: 'Bước đầu chuyển hướng chiến lược, đặt vấn đề giải phóng dân tộc lên hàng đầu.',
    context: 'Tháng 9/1939, Chiến tranh thế giới thứ II bùng nổ. Pháp thi hành chính sách thời chiến tại Đông Dương: giải tán Đảng Cộng sản, bắt bớ cán bộ, tăng thuế và lao dịch. Hoàn cảnh cách mạng thay đổi căn bản, đòi hỏi phải có đường lối mới.',
    policies: [
      'Chuyển trọng tâm sang nhiệm vụ giải phóng dân tộc thay vì cách mạng ruộng đất đơn thuần.',
      'Tạm gác khẩu hiệu "đánh đổ địa chủ, phong kiến" để tập trung chống đế quốc xâm lược.',
      'Chủ trương thành lập Mặt trận Thống nhất Phản đế Đông Dương.',
      'Xác định phương pháp đấu tranh mới phù hợp với hoàn cảnh chiến tranh thế giới.',
    ],
    significance: 'Đặt nền tảng cho quá trình chuyển hướng — bước khởi đầu quan trọng trong việc điều chỉnh đường lối trước biến động lớn của thời cuộc.',
  },
  {
    roman: 'VII', date: '11/1940', phase: 'PHÁT TRIỂN',
    fullTitle: 'Hội nghị Trung ương VII',
    thesis: 'Tiếp tục điều chỉnh và phát triển đường lối trong tình hình mới sau khi Nhật vào Đông Dương.',
    context: 'Pháp thất bại trước Đức (6/1940), Nhật đưa quân vào Đông Dương (9/1940). Phong trào Bắc Sơn nổ ra, bị đàn áp — để lại bài học về xây dựng lực lượng và thời điểm hành động.',
    policies: [
      'Tiếp tục xác định nhiệm vụ giải phóng dân tộc là trung tâm hàng đầu.',
      'Nhận định Pháp–Nhật tất yếu sẽ mâu thuẫn nhau, tạo thời cơ cho cách mạng.',
      'Chủ trương duy trì và phát triển lực lượng vũ trang từ bài học khởi nghĩa Bắc Sơn.',
      'Chuẩn bị điều kiện để khi thời cơ đến có thể phát động khởi nghĩa giành chính quyền.',
    ],
    significance: 'Phát triển đường lối, đặc biệt nhận thức mâu thuẫn Pháp–Nhật như yếu tố tạo thời cơ, và bắt đầu coi trọng vai trò của lực lượng vũ trang.',
  },
  {
    roman: 'VIII', date: '05/1941', phase: 'HOÀN THIỆN',
    fullTitle: 'Hội nghị Trung ương VIII',
    thesis: 'Hoàn thiện chuyển hướng chiến lược: xác định rõ ràng và toàn diện đường lối giải phóng dân tộc.',
    context: 'Tháng 1/1941, Nguyễn Ái Quốc về nước trực tiếp lãnh đạo sau 30 năm hoạt động ở nước ngoài. Hội nghị họp bí mật tại Pác Bó (Cao Bằng) tháng 5/1941 — hội nghị quan trọng nhất trong giai đoạn chuyển hướng chiến lược.',
    policies: [
      'Xác định mâu thuẫn chủ yếu, cấp bách: toàn dân tộc Việt Nam với đế quốc Pháp–Nhật.',
      'Giải phóng dân tộc là nhiệm vụ trung tâm, số một — trên hết mọi nhiệm vụ khác.',
      'Thành lập Mặt trận Việt Minh, tập hợp mọi lực lượng dân tộc không phân biệt giai cấp, tôn giáo.',
      'Chuẩn bị khởi nghĩa vũ trang là nhiệm vụ trung tâm; xây dựng căn cứ địa và lực lượng vũ trang.',
    ],
    significance: 'Đỉnh cao của quá trình chuyển hướng chiến lược. Đường lối rõ ràng, toàn diện — làm cơ sở trực tiếp để xây dựng lực lượng và thắng lợi Cách mạng Tháng Tám.',
    photoTitle: 'Pác Bó, Cao Bằng – nơi Hội nghị Trung ương VIII diễn ra (5/1941)',
    photoInstitution: 'Bảo tàng Hồ Chí Minh',
    photoUrl: 'https://baotanghochiminh.vn/',
  },
];

const buildingNodes = [
  { id: 'policy', label: 'Chủ trương đúng đắn', desc: 'Hội nghị VIII xác định rõ: giải phóng dân tộc là nhiệm vụ trung tâm, kim chỉ nam cho mọi hành động.', accent: 'crimson' },
  { id: 'vietminh', label: 'Mặt trận Việt Minh', desc: 'Thành lập 5/1941. Tập hợp mọi tầng lớp: công nhân, nông dân, trí thức, thương nhân, dân tộc thiểu số.', accent: 'gold' },
  { id: 'political', label: 'Lực lượng chính trị', desc: 'Phát triển các hội Cứu quốc trong Mặt trận Việt Minh; xây dựng cơ sở chính trị bí mật trên nhiều tỉnh thành.', accent: 'gold' },
  { id: 'armed', label: 'Lực lượng vũ trang', desc: 'Đội Việt Nam Tuyên truyền Giải phóng quân thành lập 22/12/1944. Phát triển từ du kích lên chính quy.', accent: 'crimson' },
  { id: 'base', label: 'Căn cứ địa', desc: 'Từ Pác Bó, căn cứ Cao–Bắc–Lạng được củng cố và mở rộng. Đến năm 1945, Tân Trào trở thành trung tâm của Khu giải phóng.', accent: 'gold' },
  { id: 'propaganda', label: 'Tuyên truyền & Tổ chức', desc: 'Báo Việt Nam Độc lập, các tổ chức cứu quốc, phong trào giác ngộ dân tộc lan rộng cả nước.', accent: 'gold' },
  { id: 'uprising', label: 'Chuẩn bị khởi nghĩa', desc: 'Tích lũy kinh nghiệm, xây dựng thế trận toàn diện, chờ thời cơ chín muồi để phát lệnh tổng khởi nghĩa.', accent: 'crimson' },
];

const accumLayers = [
  {
    id: 'political', label: 'Lực lượng chính trị', accent: 'gold',
    photoTitle: 'Mặt trận Việt Minh và phong trào cứu quốc', photoInst: 'Bảo tàng Lịch sử Quốc gia Việt Nam', photoUrl: 'https://baotanglichsu.vn/',
    events: [
      { year: '1941', desc: 'Mặt trận Việt Minh thành lập. Các hội Cứu quốc ra đời trong nhiều tầng lớp và địa phương.' },
      { year: '1942', desc: 'Củng cố các hội Cứu quốc ở Cao Bằng và từng bước mở rộng mạng lưới Việt Minh.' },
      { year: '1943', desc: 'Đẩy mạnh gây dựng cơ sở chính trị, liên lạc và tuyên truyền ở nhiều địa phương.' },
      { year: '1944', desc: 'Phong trào Việt Minh tiếp tục lan rộng; lực lượng chính trị được chuẩn bị cho khởi nghĩa.' },
    ],
  },
  {
    id: 'armed', label: 'Lực lượng vũ trang', accent: 'crimson',
    photoTitle: 'Đội Việt Nam Tuyên truyền Giải phóng quân – 22/12/1944', photoInst: 'Bảo tàng Lịch sử Quân sự Việt Nam', photoUrl: 'https://btlsqsvn.org.vn/',
    events: [
      { year: '1941', desc: 'Duy trì lực lượng vũ trang từ bài học Bắc Sơn; xây dựng các đội tự vệ bí mật.' },
      { year: '1942', desc: 'Phát triển du kích vùng núi Việt Bắc; huấn luyện chiến thuật, vũ khí.' },
      { year: '1943', desc: 'Mở rộng hoạt động quân sự; xây dựng thêm đội tự vệ cứu quốc có tổ chức.' },
      { year: '1944', desc: '22/12/1944: Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân — 34 chiến sĩ đầu tiên.' },
    ],
  },
  {
    id: 'base', label: 'Căn cứ địa', accent: 'gold',
    photoTitle: 'Pác Bó – Khuổi Nặm – Căn cứ đầu não (1941)', photoInst: 'Bảo tàng Hồ Chí Minh', photoUrl: 'https://baotanghochiminh.vn/',
    events: [
      { year: '1941', desc: 'Pác Bó (Cao Bằng) trở thành căn cứ đầu não. Hang Cốc Bó — nơi Bác làm việc và ở.' },
      { year: '1942', desc: 'Củng cố căn cứ Cao Bằng, phát triển cơ sở và các tuyến liên lạc sang Bắc Kạn, Lạng Sơn.' },
      { year: '1943', desc: 'Mở các tuyến “Nam tiến”, nối căn cứ Cao Bằng với vùng trung du và miền xuôi.' },
      { year: '1944', desc: 'Căn cứ Cao–Bắc–Lạng được củng cố, tạo bàn đạp mở rộng thành Khu giải phóng năm 1945.' },
    ],
  },
  {
    id: 'propaganda', label: 'Tuyên truyền', accent: 'gold',
    photoTitle: 'Báo Việt Nam Độc lập – số đầu tiên (1941)', photoInst: 'Thư viện Quốc gia Việt Nam', photoUrl: 'https://www.nlv.gov.vn/',
    events: [
      { year: '1941', desc: 'Báo "Việt Nam Độc lập" ra đời. Hồ Chí Minh viết thơ, bài tuyên truyền giác ngộ nhân dân.' },
      { year: '1942', desc: 'Báo chí, tờ truyền đơn bí mật phát tán sâu rộng trong dân và các tầng lớp xã hội.' },
      { year: '1943', desc: '"Đề cương về văn hóa Việt Nam" ra đời; phong trào văn hóa cứu quốc phát triển mạnh.' },
      { year: '1944', desc: 'Giáo dục chính trị, quân sự lan rộng; chuẩn bị tâm lý cho toàn dân khi lệnh phát ra.' },
    ],
  },
];

const decisions = [
  {
    date: '13/08/1945', shortDate: '13/8',
    title: 'Thành lập Ủy ban Khởi nghĩa toàn quốc',
    decision: 'Thành lập cơ quan chỉ huy tối cao để điều phối tổng khởi nghĩa trên toàn quốc.',
    why: 'Tin Nhật Bản sắp đầu hàng Đồng minh lan nhanh, báo hiệu một khoảng trống quyền lực sắp xuất hiện. Cần cơ quan chỉ huy thống nhất để hành động nhanh và không phân tán lực lượng.',
    result: 'Có cơ cấu chỉ huy tập trung, sẵn sàng phát lệnh và điều phối tổng khởi nghĩa ngay lập tức.',
    next: 'Quân lệnh số 1',
    photoInst: 'Trung tâm Lưu trữ Quốc gia III', photoUrl: 'https://luutruco.gov.vn/',
    photoTitle: 'Tài liệu thành lập Ủy ban Khởi nghĩa toàn quốc (13/8/1945)',
  },
  {
    date: '23h — 13/08/1945', shortDate: '23h 13/8',
    title: 'Quân lệnh số 1',
    decision: 'Phát lệnh tổng khởi nghĩa chính thức trên toàn quốc.',
    why: 'Thời cơ đang mở: Nhật hoang mang, quân Đồng minh chưa kịp vào. Mỗi giờ chậm trễ là thu hẹp thời cơ. Cần hành động ngay trong đêm.',
    result: 'Tín hiệu xuất phát chính thức, tạo khí thế tổng khởi nghĩa toàn quốc.',
    next: 'Hội nghị toàn quốc của Đảng',
    photoInst: 'Cục Văn thư và Lưu trữ Nhà nước', photoUrl: 'https://luutruco.gov.vn/',
    photoTitle: 'Bản gốc Quân lệnh số 1 (13/8/1945)',
  },
  {
    date: '14–15/08/1945', shortDate: '14–15/8',
    title: 'Hội nghị toàn quốc của Đảng tại Tân Trào',
    decision: 'Quyết định phát động tổng khởi nghĩa giành chính quyền trong cả nước.',
    why: 'Cần sự thống nhất ý chí và quyết tâm của toàn Đảng trước một quyết định lịch sử. Đi đến quyết định dứt khoát, không do dự.',
    result: 'Toàn Đảng thống nhất quyết tâm. Chủ trương tổng khởi nghĩa được xác nhận chính thức với đầy đủ thẩm quyền.',
    next: 'Đại hội Quốc dân',
    photoInst: 'Bảo tàng Lịch sử Quốc gia Việt Nam', photoUrl: 'https://baotanglichsu.vn/',
    photoTitle: 'Đình Tân Trào – nơi họp Hội nghị toàn quốc của Đảng',
  },
  {
    date: '16/08/1945', shortDate: '16/8',
    title: 'Đại hội Quốc dân tại Tân Trào',
    decision: 'Tán thành tổng khởi nghĩa; bầu Ủy ban Dân tộc giải phóng Việt Nam.',
    why: 'Cần tính chính danh từ đông đảo tầng lớp nhân dân — đại biểu các dân tộc, tôn giáo, giai cấp — đảm bảo cách mạng là của toàn dân.',
    result: 'Tạo cơ sở đại diện rộng rãi của toàn dân và bầu ra cơ quan quyền lực lâm thời. Hồ Chí Minh được bầu làm Chủ tịch.',
    next: 'Tổng Khởi nghĩa',
    photoInst: 'Bảo tàng Lịch sử Quốc gia Việt Nam', photoUrl: 'https://baotanglichsu.vn/',
    photoTitle: 'Cây đa Tân Trào – nơi xuất phát lệnh tổng khởi nghĩa',
  },
  {
    date: '19/08/1945', shortDate: '19/8',
    title: 'Tổng Khởi nghĩa — Hà Nội',
    decision: 'Quần chúng khởi nghĩa, giành chính quyền tại Hà Nội — mở đầu làn sóng toàn quốc.',
    why: 'Hà Nội là trung tâm chính trị quyết định. Giành được Hà Nội tạo làn sóng tâm lý lan nhanh ra cả nước.',
    result: 'Chính quyền về tay nhân dân tại Hà Nội. Làn sóng khởi nghĩa lan toàn quốc trong những ngày tiếp theo.',
    next: 'Tuyên ngôn Độc lập',
    photoInst: 'Bảo tàng Lịch sử Quốc gia Việt Nam', photoUrl: 'https://baotanglichsu.vn/',
    photoTitle: 'Nhân dân Hà Nội khởi nghĩa ngày 19/8/1945',
  },
  {
    date: '02/09/1945', shortDate: '2/9',
    title: 'Tuyên ngôn Độc lập',
    decision: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội.',
    why: 'Tuyên bố trước quốc dân và thế giới về nền độc lập của Việt Nam; xây dựng nền tảng pháp lý cho nhà nước dân chủ nhân dân đầu tiên.',
    result: 'Kết thúc hơn 80 năm thuộc địa. Khai sinh nước Việt Nam Dân chủ Cộng hòa — Độc lập, Tự do, Hạnh phúc.',
    photoInst: 'Thông tấn xã Việt Nam (TTXVN)', photoUrl: 'https://www.vietnamplus.vn/',
    photoTitle: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, 2/9/1945',
  },
];

const lessons = [
  { num: '01', keyword: 'PHÂN TÍCH & ĐIỀU CHỈNH', title: 'Nhận diện đúng vấn đề', content: 'Hoàn cảnh thay đổi đòi hỏi đánh giá lại chiến lược. Đảng không bảo thủ giữ nguyên đường lối cũ mà mạnh dạn điều chỉnh khi thực tiễn đòi hỏi.' },
  { num: '02', keyword: 'TỔ CHỨC & HÀNH ĐỘNG', title: 'Chuyển chủ trương thành lực lượng', content: 'Đường lối đúng chưa đủ. Phải được cụ thể hóa thành tổ chức, lực lượng vũ trang, căn cứ địa và tuyên truyền rộng rãi trong nhân dân.' },
  { num: '03', keyword: 'CHUẨN BỊ TRƯỜNG KỲ', title: 'Chuẩn bị trước khi thời cơ xuất hiện', content: 'Không đợi thời cơ mới bắt đầu chuẩn bị. Từ 1941 đến 1944, kiên trì xây dựng để khi thời cơ đến có thể hành động ngay lập tức.' },
  { num: '04', keyword: 'QUYẾT ĐOÁN & KỊP THỜI', title: 'Ra quyết định kịp thời', content: 'Thời cơ xuất hiện trong thời gian rất ngắn. Cần nhận thức nhanh, quyết định dứt khoát và hành động ngay. Chậm trễ có thể làm mất cơ hội lịch sử mãi mãi.' },
];

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────

const imageByTitle: Array<[string, string]> = [
  ['Hồ Chí Minh tại Pác Bó', '/image/ho-chi-minh-pac-bo.jpg'],
  ['Pác Bó, Cao Bằng', '/image/pac-bo-hoi-nghi-trung-uong-viii.jpg'],
  ['Pác Bó – Khuổi Nặm', '/image/pac-bo-khuoi-nam.jpeg'],
  ['Chiến tranh thế giới thứ II', '/image/chien-tranh-the-gioi-thu-2.jpg'],
  ['Đông Dương dưới ách thống trị kép', '/image/dong-duong-phap-nhat-1940-1945.jpg'],
  ['Đảo chính Nhật – Pháp', '/image/dao-chinh-nhat-phap-1945.jpg'],
  ['Bản chỉ thị 12/3/1945', '/image/ban-chi-thi-12-3-1945.jpg'],
  ['Bản gốc Quân lệnh số 1', '/image/quan-lenh-so-1-1945.jpg'],
  ['Tuyên ngôn Độc lập', '/image/tuyen-ngon-doc-lap-1945.jpeg'],
  ['Cây đa Tân Trào', '/image/cay-da-tan-trao.jpeg'],
  ['Nhân dân Hà Nội khởi nghĩa', '/image/nhan-dan-ha-noi-khoi-nghia-1945.jpg'],
  ['Nhật đảo chính Pháp', '/image/nhat-dao-chinh-phap.jpg'],
  ['Quần chúng Hà Nội xuống đường', '/image/quan-chung-ha-noi-thang-8-1945.jpeg'],
  ['Tài liệu thành lập Ủy ban Khởi nghĩa', '/image/tai-lieu-uy-ban-khoi-nghia-1945.jpg'],
  ['Đình Tân Trào', '/image/dinh-tan-trao.jpg'],
  ['Đội quân khởi nghĩa tiến vào Hà Nội', '/image/doi-quan-khoi-nghia-ha-noi.jpg'],
  ['Quảng trường Ba Đình', '/image/quang-truong-ba-dinh-1945.jpg'],
  ['Báo Việt Nam Độc lập', '/image/bao-viet-nam-doc-lap-1941.jpg'],
  ['Mặt trận Việt Minh', '/image/mat-tran-viet-minh.jpg'],
  ['Đội Việt Nam Tuyên truyền Giải phóng quân', '/image/doi-viet-nam-tuyen-truyen-giai-phong-quan.jpg'],
];

const imageSourceByTitle: Array<[string, string]> = [
  ['Hồ Chí Minh tại Pác Bó', 'https://hochiminh.vn/tu-lieu-anh/tu-lieu-anh-chu-tich-ho-chi-minh-tu-nam-1930-1945.html'],
  ['Pác Bó, Cao Bằng', 'https://baotanghochiminh.vn/bien-nien-tieu-su/p-845.htm'],
  ['Pác Bó – Khuổi Nặm', 'https://hochiminh.vn/tu-tuong-dao-duc-ho-chi-minh/cao-bang-tam-nhin-va-su-lua-chon-chien-luoc-cua-chu-tich-ho-chi-minh-nam-1941-va-bai-hoc-doi-voi-su-nghiep-xay-dung-bao-.html'],
  ['Chiến tranh thế giới thứ II', 'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/chien-tranh-the-gioi-thu-hai-1939-1945-3354'],
  ['Đông Dương dưới ách thống trị kép', 'https://baotanglichsu.vn/vi/Articles/3097/17061/74-nam-nhat-vaodjong-duong-cham-dut-ach-thong-tri-cua-phap-tai-viet-nam.html'],
  ['Đảo chính Nhật – Pháp', 'https://baotanglichsu.vn/vi/Articles/3097/19449/su-thanh-lap-chinh-phu-tran-trong-kim-1945.html'],
  ['Nhật đảo chính Pháp', 'https://baotanglichsu.vn/vi/Articles/3097/19449/su-thanh-lap-chinh-phu-tran-trong-kim-1945.html'],
  ['Bản chỉ thị 12/3/1945', 'https://baotanglichsu.vn/vi/Articles/1002/73335/suu-tap-hien-vat-ve-cach-mang-thang-tam-nam-1945-tai-bao-tang-lich-su-quoc-gia.html'],
  ['Bản gốc Quân lệnh số 1', 'https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/dac-trung-cua-cach-mang-thang-tam.htm'],
  ['Tài liệu thành lập Ủy ban Khởi nghĩa', 'https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/dac-trung-cua-cach-mang-thang-tam.htm'],
  ['Tuyên ngôn Độc lập', 'https://hochiminh.vn/tu-tuong-dao-duc-ho-chi-minh/nghien-cuu-tu-tuong-dao-duc-ho-chi-minh/tuyen-ngon-doc-lap-ang-van-lap-quoc-vi-dai-7396'],
  ['Quảng trường Ba Đình', 'https://hochiminh.vn/tin-tuc/ngay-2-9-1945-moc-son-choi-loi-cua-mot-dan-toc-anh-hung-9459'],
  ['Cây đa Tân Trào', 'https://baotanglichsu.vn/vi/Articles/2001/66620/10-djia-danh-noi-tieng-gan-voi-cach-mang-thang-tam.html'],
  ['Đình Tân Trào', 'https://baotanglichsu.vn/vi/Articles/2001/66620/10-djia-danh-noi-tieng-gan-voi-cach-mang-thang-tam.html'],
  ['Nhân dân Hà Nội khởi nghĩa', 'https://baotanglichsu.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html'],
  ['Quần chúng Hà Nội xuống đường', 'https://baotanglichsu.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html'],
  ['Đội quân khởi nghĩa tiến vào Hà Nội', 'https://baotanglichsu.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html'],
  ['Báo Việt Nam Độc lập', 'https://baotanglichsu.vn/vi/Articles/1002/28326/bao-viet-nam-djoc-lap.html'],
  ['Mặt trận Việt Minh', 'https://baotanglichsu.vn/vi/Articles/3097/16382/19-5-1941-thanh-lap-mat-tran-viet-minh.html'],
  ['Đội Việt Nam Tuyên truyền Giải phóng quân', 'https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/15595-doi-viet-nam-tuyen-truyen-giai-phong-quan-voi-loi-the-vi-nuoc-vi-dan.html'],
];

function Img({ title, inst, url, aspect = '3/2', className = '' }: {
  title?: string; inst?: string; url?: string; aspect?: string; className?: string;
}) {
  const imagePath = title ? imageByTitle.find(([label]) => title.includes(label))?.[1] : undefined;
  const sourceUrl = title ? imageSourceByTitle.find(([label]) => title.includes(label))?.[1] ?? url : url;
  return (
    <figure className={className}>
      <div
        className="border border-gold-900/30 bg-ink-800 relative overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: aspect }}
      >
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold-800/60" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold-800/60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold-800/60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold-800/60" />
        {imagePath ? (
          <img src={imagePath} alt={title ?? ''} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          title && <p className="text-parchment-600 text-xs leading-relaxed text-center p-6">{title}</p>
        )}
      </div>
      {(title || inst) && (
        <figcaption className="mt-2 flex items-start justify-between gap-3 text-[10px] leading-relaxed text-parchment-600">
          <span className="line-clamp-2">{title}</span>
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noreferrer"
              className="flex-shrink-0 text-gold-700 hover:text-gold-400 underline underline-offset-2 transition-colors">
              Nguồn: {inst ?? 'mở liên kết'} ↗
            </a>
          ) : inst ? <span className="flex-shrink-0">Nguồn: {inst}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}

function Sources({ entries }: { entries: SourceEntry[] }) {
  const labels: Record<SourceEntry['type'], string> = {
    document: 'Tài liệu',
    photo: 'Hình ảnh',
    interpretation: 'Diễn giải',
  };

  return (
    <FadeIn className="mt-12">
      <details className="group border border-ink-600 bg-ink-800/20">
        <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 text-xs font-mono tracking-widest text-gold-600 hover:text-gold-400 transition-colors">
          <span>NGUỒN KIỂM CHỨNG · {entries.length} LIÊN KẾT</span>
          <span className="text-parchment-600 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="border-t border-ink-600 p-5 grid md:grid-cols-2 gap-3">
          {entries.map((entry, index) => (
            <div key={`${entry.title}-${index}`} className="border border-ink-700 bg-ink-900/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] tracking-widest text-crimson-400">{labels[entry.type].toUpperCase()}</span>
                {entry.date && <span className="font-mono text-[9px] text-parchment-700">· {entry.date}</span>}
              </div>
              {entry.url ? (
                <a href={entry.url} target="_blank" rel="noreferrer" className="text-parchment-200 hover:text-gold-300 text-sm font-semibold leading-snug underline decoration-gold-900 underline-offset-4 transition-colors">
                  {entry.title} ↗
                </a>
              ) : (
                <div className="text-parchment-300 text-sm font-semibold leading-snug">{entry.title}</div>
              )}
              <div className="text-parchment-600 text-xs mt-2">{entry.institution}</div>
              {entry.notes && <p className="text-parchment-700 text-xs mt-2 leading-relaxed">{entry.notes}</p>}
            </div>
          ))}
        </div>
      </details>
    </FadeIn>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-1.5">
      <div className="w-px h-4 bg-gold-900/50" />
      <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '7px solid rgba(107,78,8,0.5)' }} />
    </div>
  );
}

// Fade-in wrapper
function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}>
      {children}
    </div>
  );
}

// Section header
function SH({ num, label, title, subtitle }: { num: string; label: string; title: string; subtitle?: string }) {
  return (
    <FadeIn className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-crimson-500 text-xs tracking-widest">{num}</span>
        <div className="h-px w-10 bg-crimson-800/50" />
        <span className="text-parchment-600 text-xs tracking-widest uppercase">{label}</span>
      </div>
      <h2 className="font-bold text-3xl lg:text-4xl text-parchment-100 mb-3 leading-tight">{title}</h2>
      {subtitle && <p className="text-parchment-500 max-w-2xl leading-relaxed text-base">{subtitle}</p>}
    </FadeIn>
  );
}

// ─── SIDE NAV ────────────────────────────────────────────────────────────────

function SideNav({ active }: { active: string }) {
  const [mob, setMob] = useState(false);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMob(false); };

  return (
    <>
      <button onClick={() => setMob(true)} className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-ink-800 border border-ink-600 flex items-center justify-center">
        <svg width="14" height="11" fill="none" stroke="#cfc09a" strokeWidth="1.5"><line x1="0" y1="1" x2="14" y2="1"/><line x1="0" y1="5.5" x2="14" y2="5.5"/><line x1="0" y1="10" x2="14" y2="10"/></svg>
      </button>
      {mob && <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setMob(false)} />}
      <nav className={`fixed top-0 left-0 h-full z-50 bg-ink-900 border-r border-ink-700/50 flex flex-col transition-transform duration-300 ${mob ? 'translate-x-0 w-56' : '-translate-x-full lg:translate-x-0 lg:w-[70px]'}`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-14 border-b border-ink-700/50 flex-shrink-0">
          <div className="w-8 h-8 bg-crimson-800 flex items-center justify-center">
            <span className="font-display text-parchment-200 text-xs font-bold">VN</span>
          </div>
        </div>
        {/* Links */}
        <div className="flex-1 flex flex-col py-2 overflow-y-auto">
          {NAV.map(s => {
            const on = active === s.id;
            return (
              <button key={s.id} onClick={() => go(s.id)}
                className={`relative flex flex-col items-center py-2.5 px-1 text-center transition-colors duration-150 ${on ? 'text-gold-400' : 'text-parchment-700 hover:text-parchment-400'}`}>
                {on && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-crimson-600" />}
                <span className={`font-mono text-xs mb-0.5 ${on ? 'text-crimson-400' : ''}`}>{s.num}</span>
                <span className="leading-tight hidden lg:block" style={{ fontSize: '8px', maxWidth: '52px', wordBreak: 'break-word' }}>{s.label}</span>
                <span className="lg:hidden text-xs">{s.label}</span>
              </button>
            );
          })}
        </div>
        {/* Year marks */}
        <div className="p-3 border-t border-ink-700/50 text-center flex-shrink-0">
          <div className="font-display text-crimson-700 text-xs">1939</div>
          <div className="w-px h-3 bg-ink-600 mx-auto my-1" />
          <div className="font-display text-gold-600 text-xs">1945</div>
        </div>
      </nav>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#070402' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 80% at 20% 60%, rgba(140,28,19,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 30%, rgba(196,154,34,0.04) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'linear-gradient(rgba(196,154,34,1) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,34,1) 1px,transparent 1px)', backgroundSize: '70px 70px' }} />
      </div>

      <div className="relative flex-1 flex items-center lg:pl-[70px]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-16">
          <div className="grid lg:grid-cols-11 gap-10 lg:gap-20 items-center">

            {/* Left: hero content */}
            <div className="lg:col-span-7">
              {/* Headline years */}
              <div className="relative mb-10">
                <div className="font-display font-black leading-[0.85] select-none" style={{ fontSize: 'clamp(64px, 13vw, 140px)', color: 'rgba(140,28,19,0.18)' }}>1939</div>
                <div className="flex items-center gap-4 my-2 ml-1">
                  <div className="h-px bg-gold-800/50 w-6" />
                  <span className="font-mono text-gold-800 text-xs tracking-widest">CHUYỂN HƯỚNG CHIẾN LƯỢC</span>
                  <div className="h-px bg-gold-800/50 w-6" />
                </div>
                <div className="font-display font-black leading-[0.85] select-none" style={{ fontSize: 'clamp(64px, 13vw, 140px)', color: 'rgba(196,154,34,0.22)' }}>1945</div>
                {/* Connecting arrow */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-1 opacity-20">
                  <div className="w-px h-16 bg-gold-600" />
                  <div style={{ width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'10px solid rgba(196,154,34,1)' }} />
                </div>
              </div>

              {/* Title */}
              <h1 className="font-bold text-2xl lg:text-[1.7rem] xl:text-3xl text-parchment-100 leading-snug mb-5">
                Con đường từ chuyển hướng giải phóng dân tộc<br />
                <span className="text-gold-400">đến Cách mạng Tháng Tám</span>
              </h1>

              {/* Hook */}
              <p className="text-parchment-400 text-base leading-relaxed mb-8 max-w-lg pl-4 border-l-2 border-crimson-800/50">
                Vì sao cách mạng Việt Nam phải chuyển hướng, và những quyết định chiến lược nào tạo nên khả năng chớp thời cơ và giành chính quyền năm 1945?
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-5 mb-10">
                <button onClick={() => document.getElementById('boicanh')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-crimson-700 hover:bg-crimson-600 text-parchment-100 px-7 py-3 text-sm font-semibold tracking-wide transition-colors duration-200">
                  Bắt đầu →
                </button>
                <span className="font-mono text-parchment-700 text-xs">10 chương · Khám phá quá trình lịch sử</span>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="lg:col-span-4">
              <Img
                title="Hồ Chí Minh tại Pác Bó, Cao Bằng – Hội nghị Trung ương VIII (5/1941)"
                inst="Bảo tàng Hồ Chí Minh"
                url="https://baotanghochiminh.vn/"
                aspect="2/3"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-5 font-mono text-[9px] tracking-wide text-parchment-700/60">
        AI declaration · Nội dung có hỗ trợ AI
      </div>
    </section>
  );
}

// ─── SECTION 01: BỐI CẢNH ───────────────────────────────────────────────────

function S01() {
  const srcs: SourceEntry[] = [
    { type:'document', title:'Chiến tranh thế giới thứ hai (1939–1945)', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/su-kien-va-nhan-chung/chien-tranh-the-gioi-thu-hai-1939-1945-3354' },
    { type:'document', title:'Nhật vào Đông Dương, chấm dứt ách thống trị của Pháp tại Việt Nam', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/17061/74-nam-nhat-vaodjong-duong-cham-dut-ach-thong-tri-cua-phap-tai-viet-nam.html' },
    { type:'document', title:'Nạn đói 1944–1945: Ký ức không thể phai mờ', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/16806/nan-djoi-1944-1945-ky-uc-70-nam-khong-the-phai-mo.html' },
    { type:'interpretation', title:'Phân tích quan hệ giữa biến động thế giới và yêu cầu chuyển hướng trong nước', institution:'Nhóm biên soạn', notes:'Tổng hợp, diễn giải từ ba nguồn chính thức trên.' },
  ];

  return (
    <section id="boicanh" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-20">
        <SH num="01" label="Bối cảnh" title="Bối cảnh Thế giới & Trong nước"
          subtitle="Để hiểu vì sao cách mạng phải chuyển hướng, cần nắm sự thay đổi căn bản của tình hình thế giới và trong nước từ năm 1939." />

        {/* Split screen */}
        <div className="grid lg:grid-cols-2 gap-0 border border-ink-600 mb-14">
          {/* World */}
          <div className="border-r border-ink-600 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-crimson-700" />
              <span className="font-mono text-crimson-400 text-xs tracking-widest">THẾ GIỚI</span>
            </div>
            <Img title="Chiến tranh thế giới thứ II bùng nổ – Châu Âu 1939" inst="Bảo tàng Lịch sử Quốc gia Việt Nam" url="https://baotanglichsu.vn/" aspect="16/9" className="mb-7" />
            <div className="space-y-6">
              {worldEvents.map(ev => (
                <FadeIn key={ev.date}>
                  <div className="border-l-2 border-crimson-800/40 pl-4 group">
                    <div className="font-mono text-crimson-400 text-xs tracking-widest mb-1">{ev.date}</div>
                    <div className="text-parchment-200 text-sm font-semibold leading-snug mb-1">{ev.event}</div>
                    <div className="text-parchment-500 text-xs leading-relaxed">{ev.impact}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Vietnam */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gold-700" />
              <span className="font-mono text-gold-500 text-xs tracking-widest">VIỆT NAM / ĐÔNG DƯƠNG</span>
            </div>
            <Img title="Đông Dương dưới ách thống trị kép Pháp–Nhật (1940–1945)" inst="Trung tâm Lưu trữ Quốc gia III" url="https://luutruco.gov.vn/" aspect="16/9" className="mb-7" />
            <div className="space-y-6">
              {vietnamEvents.map(ev => (
                <FadeIn key={ev.date}>
                  <div className="border-l-2 border-gold-800/40 pl-4">
                    <div className="font-mono text-gold-600 text-xs tracking-widest mb-1">{ev.date}</div>
                    <div className="text-parchment-200 text-sm font-semibold leading-snug mb-1">{ev.event}</div>
                    <div className="text-parchment-500 text-xs leading-relaxed">{ev.impact}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Transition */}
        <FadeIn>
          <div className="border border-crimson-800/40 bg-crimson-950/20 p-8 text-center">
            <p className="font-display italic text-xl lg:text-2xl text-parchment-200 leading-relaxed mb-3">
              "Hoàn cảnh đã thay đổi. Vậy nhiệm vụ của cách mạng có cần thay đổi không?"
            </p>
            <p className="text-parchment-500 text-sm mb-6">→ Đây là câu hỏi mà ba Hội nghị Trung ương VI – VII – VIII phải trả lời.</p>
          </div>
        </FadeIn>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 02: VẤN ĐỀ ─────────────────────────────────────────────────────

const argSteps = [
  { id:'ctx', tag:'HOÀN CẢNH MỚI', accent:'neutral', content:'Chiến tranh thế giới II bùng nổ — Nhật vào Đông Dương — Pháp suy yếu và hoang mang.' },
  { id:'con', tag:'MÂU THUẪN DÂN TỘC GAY GẮT', accent:'gold', content:'Mâu thuẫn giữa toàn thể dân tộc Việt Nam với chủ nghĩa đế quốc Pháp–Nhật trở nên sâu sắc và quyết liệt hơn bao giờ hết.' },
  { id:'dan', tag:'NGUY CƠ MẤT NƯỚC', accent:'crimson', content:'Vận mệnh dân tộc nguy vong. Vấn đề dân tộc trở thành vấn đề số một, cấp bách nhất.' },
  { id:'dec', tag:'VẤN ĐỀ CẤP BÁCH', accent:'gold', content:'', highlight: 'GIẢI PHÓNG DÂN TỘC' },
];

function S02() {
  const [step, setStep] = useState(0);
  const [showBox, setShowBox] = useState(false);
  const srcs: SourceEntry[] = [
    { type:'document', title:'Nghị quyết Ban Trung ương Đảng ngày 6–9/11/1939', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/hoi-nghi-bch-trung-uong/khoa-i/nghi-quyet-cua-ban-trung-uong-dang-ngay-6-7-8-9-11-1939-659', date:'11/1939' },
    { type:'document', title:'Nghị quyết Hội nghị Trung ương ngày 6–9/11/1940', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/hoi-nghi-bch-trung-uong/khoa-i/nghi-quyet-cua-hoi-nghi-trung-uong-ngay-6-7-8-9-11-1940-660', date:'11/1940' },
  ];

  const shown = argSteps.slice(0, step + 1);
  const canAdvance = step < argSteps.length - 1;

  useEffect(() => {
    if (step === argSteps.length - 1) {
      const t = setTimeout(() => setShowBox(true), 600);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <section id="vandede" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]" style={{ background: 'rgba(5,3,1,0.5)' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-16 py-20">
        <SH num="02" label="Vấn đề đặt ra" title="Vấn đề đặt ra"
          subtitle="Trong hoàn cảnh mới, cách mạng đứng trước một câu hỏi chiến lược không thể né tránh." />

        <div className="flex flex-col items-center max-w-lg mx-auto">
          {/* Argument steps */}
          {shown.map((s, i) => (
            <div key={s.id} className="w-full">
              <div className={`border p-5 transition-all duration-500 ${
                s.accent === 'crimson' ? 'border-crimson-800/50 bg-crimson-950/20' :
                s.accent === 'gold' ? 'border-gold-800/40 bg-gold-950/10' :
                'border-ink-600 bg-ink-800/50'
              }`}>
                <div className={`font-mono text-xs tracking-widest mb-2 ${
                  s.accent === 'crimson' ? 'text-crimson-400' :
                  s.accent === 'gold' ? 'text-gold-600' : 'text-parchment-600'
                }`}>{s.tag}</div>
                {s.highlight ? (
                  <div className="text-center py-2">
                    <div className="font-display font-bold text-parchment-100 leading-tight mb-2" style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
                      {s.highlight}
                    </div>
                    <p className="text-parchment-500 text-sm">Phải đặt nhiệm vụ giải phóng dân tộc lên hàng đầu — trên hết mọi nhiệm vụ khác.</p>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed ${s.accent === 'neutral' ? 'text-parchment-200 font-medium' : 'text-parchment-300'}`}>{s.content}</p>
                )}
              </div>
              {i < shown.length - 1 && <Arrow />}
            </div>
          ))}

          {/* Advance button */}
          {canAdvance && (
            <div className="mt-5">
              <Arrow />
              <button onClick={() => setStep(s => s + 1)}
                className="mt-2 border border-gold-800/40 bg-gold-950/10 hover:bg-gold-950/20 text-gold-400 hover:text-gold-300 px-5 py-2.5 text-xs font-mono tracking-widest transition-all duration-200">
                TIẾP THEO →
              </button>
            </div>
          )}

          {/* Decision box */}
          {showBox && (
            <div className="w-full mt-5 border border-gold-700/40 bg-ink-800/50 p-6 transition-all duration-500">
              <div className="font-mono text-gold-500 text-xs tracking-widest mb-3 text-center">QUYẾT ĐỊNH CHIẾN LƯỢC</div>
              <p className="text-parchment-400 text-sm text-center leading-relaxed mb-4">
                "Trong hoàn cảnh mới, có cần điều chỉnh trọng tâm chiến lược không?"
              </p>
              <div className="border-t border-ink-600 pt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-gold-600" />
                <p className="text-gold-400 text-sm font-semibold">CÓ. Và điều chỉnh đó được thực hiện qua ba Hội nghị.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 max-w-xl mx-auto border-l-2 border-gold-800/50 pl-5">
          <p className="text-parchment-400 text-base leading-relaxed italic">
            "Vấn đề đặt ra không chỉ là tiếp tục đấu tranh, mà là xác định đúng nhiệm vụ cần ưu tiên trong hoàn cảnh cụ thể này."
          </p>
        </div>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 03: BA HỘI NGHỊ ────────────────────────────────────────────────

function S03() {
  const [sel, setSel] = useState('VIII');
  const cur = conferences.find(c => c.roman === sel)!;
  const srcs: SourceEntry[] = [
    { type:'document', title:'Nghị quyết Ban Trung ương Đảng ngày 6–9/11/1939', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/hoi-nghi-bch-trung-uong/khoa-i/nghi-quyet-cua-ban-trung-uong-dang-ngay-6-7-8-9-11-1939-659', date:'Hội nghị VI' },
    { type:'document', title:'Nghị quyết Hội nghị Trung ương ngày 6–9/11/1940', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/hoi-nghi-bch-trung-uong/khoa-i/nghi-quyet-cua-hoi-nghi-trung-uong-ngay-6-7-8-9-11-1940-660', date:'Hội nghị VII' },
    { type:'document', title:'Biên niên Hội nghị Trung ương VIII tại Pác Bó', institution:'Bảo tàng Hồ Chí Minh', url:'https://baotanghochiminh.vn/bien-nien-tieu-su/p-845.htm', date:'10–19/05/1941' },
    { type:'document', title:'Niên biểu Ban Chấp hành Trung ương khóa I', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/ban-chap-hanh-trung-uong-dang/dai-hoi-dang/lan-thu-i/nien-bieu-toan-khoa-27' },
  ];

  return (
    <section id="hoinghi" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-20">
        <SH num="03" label="Hội nghị Trung ương" title="Ba Hội nghị Trung ương VI – VII – VIII"
          subtitle="Không phải ba sự kiện riêng lẻ — đây là một quá trình chuyển hướng chiến lược liên tục, từ khởi đầu đến hoàn thiện." />

        {/* Process timeline selector */}
        <FadeIn className="mb-10">
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-gold-900/40 hidden lg:block" />
            <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
              {conferences.map((conf, i) => (
                <div key={conf.roman} className="flex lg:flex-col items-center gap-4 lg:gap-2 relative">
                  {i > 0 && <div className="lg:hidden w-px h-4 bg-gold-900/40" />}
                  <button onClick={() => setSel(conf.roman)}
                    className={`relative z-10 flex flex-col items-center px-8 py-5 border transition-all duration-200 min-w-[160px] ${
                      sel === conf.roman ? 'border-gold-600/60 bg-gold-950/20 shadow-[0_0_30px_rgba(196,154,34,0.06)]' : 'border-ink-600 bg-ink-900 hover:border-ink-500'
                    }`}>
                    <div className={`font-display text-4xl font-bold mb-1 ${sel===conf.roman?'text-gold-400':'text-parchment-700'}`}>{conf.roman}</div>
                    <div className={`font-mono text-xs mb-2 ${sel===conf.roman?'text-parchment-400':'text-parchment-600'}`}>{conf.date}</div>
                    <div className={`font-mono text-xs tracking-wider ${sel===conf.roman?'text-crimson-400':'text-parchment-700'}`}>{conf.phase}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Detail panel */}
        <FadeIn key={sel}>
          <div className="border border-ink-600 bg-ink-800/20">
            {/* Top */}
            <div className={`border-b border-ink-600 p-6 lg:p-8 grid gap-8 items-start ${cur.photoTitle ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
              <div className={cur.photoTitle ? 'lg:col-span-2' : ''}>
                <div className="font-mono text-gold-600 text-xs tracking-widest mb-2">{cur.date}</div>
                <h3 className="text-parchment-100 text-xl font-bold mb-3">{cur.fullTitle}</h3>
                <p className="text-parchment-300 text-base leading-relaxed italic border-l-2 border-gold-800/50 pl-4">{cur.thesis}</p>
              </div>
              {cur.photoTitle && <Img title={cur.photoTitle} inst={cur.photoInstitution} url={cur.photoUrl} aspect="4/3" />}
            </div>
            {/* Body */}
            <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-8">
              <div>
                <div className="font-mono text-xs text-parchment-600 tracking-widest mb-4 flex items-center gap-2"><span className="w-4 h-px bg-parchment-700"/>BỐI CẢNH</div>
                <p className="text-parchment-400 text-sm leading-relaxed">{cur.context}</p>
              </div>
              <div>
                <div className="font-mono text-xs text-gold-600 tracking-widest mb-4 flex items-center gap-2"><span className="w-4 h-px bg-gold-800"/>CHỦ TRƯƠNG</div>
                <ol className="space-y-3">
                  {cur.policies.map((p, i) => (
                    <li key={i} className="flex gap-3 text-sm text-parchment-300 leading-relaxed">
                      <span className="font-mono text-gold-700 text-xs mt-0.5 flex-shrink-0">{i+1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="font-mono text-xs text-crimson-400 tracking-widest mb-4 flex items-center gap-2"><span className="w-4 h-px bg-crimson-800"/>Ý NGHĨA</div>
                <p className="text-parchment-400 text-sm leading-relaxed mb-5">{cur.significance}</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Summary */}
        <FadeIn className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 flex-wrap mb-3">
            {conferences.map((c,i) => (
              <div key={c.roman} className="flex items-center gap-6">
                {i>0 && <div className="text-gold-800 text-2xl">→</div>}
                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-gold-700 mb-1">{c.roman}</div>
                  <div className="font-mono text-xs text-parchment-600">{c.phase}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="font-mono text-parchment-600 text-sm tracking-wide">KHỞI ĐẦU → PHÁT TRIỂN → HOÀN THIỆN</div>
        </FadeIn>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 04: XÂY DỰNG LỰC LƯỢNG ────────────────────────────────────────

function S04() {
  const [exp, setExp] = useState<string|null>(null);
  const srcs: SourceEntry[] = [
    { type:'document', title:'Chương trình Việt Minh', institution:'Tư liệu – Văn kiện Đảng Cộng sản Việt Nam', url:'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/hoi-nghi-bch-trung-uong/khoa-i/chuong-trinh-viet-minh-665' },
    { type:'document', title:'Đội Việt Nam Tuyên truyền Giải phóng quân với lời thề vì nước, vì dân', institution:'Bộ Tư lệnh Bảo vệ Lăng Chủ tịch Hồ Chí Minh – Bộ Quốc phòng', url:'https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/15595-doi-viet-nam-tuyen-truyen-giai-phong-quan-voi-loi-the-vi-nuoc-vi-dan.html', date:'22/12/1944' },
    { type:'photo', title:'19/5/1941: Thành lập Mặt trận Việt Minh', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/16382/19-5-1941-thanh-lap-mat-tran-viet-minh.html' },
    { type:'interpretation', title:'Phân tích quá trình chuyển chủ trương thành lực lượng', institution:'Nhóm biên soạn', notes:'Tổng hợp từ tài liệu đã công bố.' },
  ];

  return (
    <section id="xaydung" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]" style={{ background:'rgba(5,3,1,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-16 py-20">
        <SH num="04" label="Từ chủ trương đến lực lượng" title="Từ Chủ trương đến Xây dựng Lực lượng" />

        <FadeIn className="flex flex-wrap items-center gap-4 mb-14">
          <div className="border border-gold-800/40 bg-gold-950/10 px-5 py-3">
            <p className="text-gold-300 text-base font-medium">"Có chủ trương đúng đã đủ chưa?"</p>
          </div>
          <p className="text-parchment-500 text-sm max-w-xs leading-relaxed">→ Chưa. Chủ trương phải được chuyển hóa thành tổ chức và lực lượng thực tế.</p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Flow nodes */}
          <div>
            <div className="flex flex-col items-start">
              {buildingNodes.map((node, i) => (
                <div key={node.id} className="w-full">
                  <button onClick={() => setExp(exp===node.id?null:node.id)}
                    className={`w-full border p-4 text-left transition-all duration-200 ${
                      node.accent==='crimson' ? 'border-crimson-800/40 bg-crimson-950/15 hover:bg-crimson-950/25' : 'border-gold-800/30 bg-gold-950/10 hover:bg-gold-950/15'
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className={`font-mono text-xs tracking-widest mb-1 ${node.accent==='crimson'?'text-crimson-500':'text-gold-600'}`}>
                          {String(i+1).padStart(2,'0')}
                        </div>
                        <div className="text-parchment-200 text-sm font-semibold">{node.label}</div>
                      </div>
                      <span className="text-parchment-600 text-xs mt-0.5">{exp===node.id?'▲':'▼'}</span>
                    </div>
                    {exp===node.id && (
                      <div className="mt-3 pt-3 border-t border-ink-600/60 space-y-3">
                        <p className="text-parchment-400 text-xs leading-relaxed">{node.desc}</p>
                      </div>
                    )}
                  </button>
                  {i < buildingNodes.length-1 && <Arrow />}
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <FadeIn>
              <Img title="Thành lập Mặt trận Việt Minh (5/1941)" inst="Bảo tàng Lịch sử Quốc gia Việt Nam" url="https://baotanglichsu.vn/" aspect="4/3" />
            </FadeIn>
            <FadeIn>
              <Img title="Đội Việt Nam Tuyên truyền Giải phóng quân – 22/12/1944" inst="Bảo tàng Lịch sử Quân sự Việt Nam" url="https://btlsqsvn.org.vn/" aspect="4/3" />
            </FadeIn>
            <FadeIn>
              <div className="border-l-4 border-gold-800/50 pl-5">
                <p className="text-parchment-300 text-base leading-relaxed italic mb-4">
                  "Chủ trương chỉ trở thành sức mạnh khi được chuyển hóa thành tổ chức và lực lượng."
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 05: 1941–1944 ──────────────────────────────────────────────────

function S05() {
  const [activeL, setActiveL] = useState('political');
  const cur = accumLayers.find(l=>l.id===activeL)!;
  const srcs: SourceEntry[] = [
    { type:'document', title:'Mặt trận Việt Minh với cách mạng Việt Nam', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3096/19262/mat-tran-viet-minh-voi-cach-mang-viet-nam.html' },
    { type:'document', title:'Nguyễn Ái Quốc về nước và công tác chuẩn bị lực lượng 1941–1944', institution:'Bảo tàng Hồ Chí Minh', url:'https://baotanghochiminh.vn/ky-niem-82-nam-ngay-lanh-tu-nguyen-ai-quoc-ve-nuoc-dau-moc-quan-trong-trong-lich-su-dang-va-cach-mang-viet-nam.htm' },
    { type:'photo', title:'Báo Việt Nam Độc Lập, số 1 (101), ngày 1/8/1941', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/1002/28326/bao-viet-nam-djoc-lap.html' },
    { type:'document', title:'Đội Việt Nam Tuyên truyền Giải phóng quân với lời thề vì nước, vì dân', institution:'Bộ Quốc phòng', url:'https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/15595-doi-viet-nam-tuyen-truyen-giai-phong-quan-voi-loi-the-vi-nuoc-vi-dan.html' },
  ];

  return (
    <section id="tichluy" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-20">
        <SH num="05" label="Tích lũy lực lượng" title="1941–1944: Tích lũy Lực lượng"
          subtitle="Thời cơ chưa đến — nhưng lực lượng phải sẵn sàng." />

        {/* Year bar */}
        <FadeIn>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['1941','1942','1943','1944'].map(y => (
              <div key={y} className="text-center">
                <div className="font-display text-gold-700/40 font-bold text-2xl">{y}</div>
                <div className="h-px bg-gold-900/30 mt-2" />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Layer tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {accumLayers.map(l => (
            <button key={l.id} onClick={()=>setActiveL(l.id)}
              className={`px-4 py-2 text-xs font-mono tracking-wide border transition-all duration-200 ${
                activeL===l.id ? 'border-gold-600/60 bg-gold-950/20 text-gold-300' : 'border-ink-600 text-parchment-600 hover:border-ink-500 hover:text-parchment-400'
              }`}>
              {l.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Layer content */}
        <FadeIn key={activeL} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cur.events.map(ev => (
            <div key={ev.year} className={`border p-4 ${cur.accent==='crimson'?'border-crimson-800/40 bg-crimson-950/10':'border-gold-800/30 bg-gold-950/10'}`}>
              <div className={`font-mono text-sm font-bold mb-2 ${cur.accent==='crimson'?'text-crimson-400':'text-gold-600'}`}>{ev.year}</div>
              <p className="text-parchment-400 text-xs leading-relaxed">{ev.desc}</p>
            </div>
          ))}
        </FadeIn>

        {/* Photo + results */}
        <FadeIn className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Img title={cur.photoTitle} inst={cur.photoInst} url={cur.photoUrl} aspect="16/9" />
          </div>
          <div className="border border-gold-800/30 bg-gold-950/10 p-6">
            <div className="font-mono text-gold-500 text-xs tracking-widest mb-4">KẾT QUẢ 1941–1944</div>
            <ul className="space-y-3">
              {['Mặt trận Việt Minh hoạt động rộng khắp','Đội quân chủ lực đầu tiên ra đời (22/12/1944)','Căn cứ địa Việt Bắc vững chắc','Tổ chức và lực lượng sẵn sàng hành động'].map(item => (
                <li key={item} className="flex gap-2 items-start text-sm text-parchment-400">
                  <span className="text-gold-600 flex-shrink-0 mt-0.5">→</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn className="mt-10 border-l-4 border-crimson-800/50 pl-5 max-w-xl">
          <p className="text-parchment-300 text-base leading-relaxed italic">
            "Không chờ thời cơ mới chuẩn bị. Chuẩn bị để khi thời cơ xuất hiện có thể hành động ngay lập tức."
          </p>
        </FadeIn>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 06: BƯỚC NGOẶT 3/1945 ─────────────────────────────────────────

const marchSteps = [
  { step:'09/03/1945', title:'Nhật đảo chính Pháp', desc:'Đêm 9 rạng 10/3/1945, Nhật Bản bất ngờ tấn công và lật đổ toàn bộ hệ thống cai trị của Pháp trên khắp Đông Dương.', impact:'Trong một đêm, hệ thống thống trị 80 năm của Pháp bị xóa sổ hoàn toàn.', hi:true },
  { step:'Ngay sau', title:'Cục diện thay đổi căn bản', desc:'Phát xít Nhật độc chiếm Đông Dương nhưng đang suy yếu trên mặt trận Thái Bình Dương. Đối tượng trực tiếp của cách mạng chuyển thành phát xít Nhật.', impact:'Cuộc khủng hoảng chính trị sâu sắc mở ra thời kỳ tiền khởi nghĩa.', hi:false },
  { step:'12/03/1945', title:'Chỉ thị "Nhật – Pháp bắn nhau và hành động của chúng ta"', desc:'Ban Thường vụ Trung ương Đảng ra Chỉ thị kịp thời: phân tích tình hình mới, xác định kẻ thù chính là Nhật, chuyển hướng đấu tranh phù hợp.', impact:'Đảng nắm bắt thời cơ và đưa ra chủ trương đúng đắn, kịp thời.', hi:true },
  { step:'3–8/1945', title:'Cao trào kháng Nhật cứu nước', desc:'Phong trào kháng Nhật bùng lên mạnh mẽ từ Bắc vào Nam. Quần chúng sẵn sàng vùng lên khi có lệnh.', impact:'Lực lượng cách mạng được thử thách, rèn luyện và mở rộng nhanh chóng.', hi:false },
];

function S06() {
  const srcs: SourceEntry[] = [
    { type:'document', title:'Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta” trong sưu tập hiện vật Cách mạng Tháng Tám', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/1002/73335/suu-tap-hien-vat-ve-cach-mang-thang-tam-nam-1945-tai-bao-tang-lich-su-quoc-gia.html', date:'12/03/1945' },
    { type:'document', title:'Sự thành lập Chính phủ Trần Trọng Kim, 1945', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/19449/su-thanh-lap-chinh-phu-tran-trong-kim-1945.html', date:'09/03/1945' },
    { type:'document', title:'Chủ động khởi nghĩa thành công – nội dung và ý nghĩa của Chỉ thị 12/3/1945', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3096/12249/67-nam-cach-mang-thang-8-ky-3-chu-djong-khoi-nghia-thanh-cong.html' },
  ];

  return (
    <section id="buocngoat" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]" style={{ background:'rgba(5,3,1,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-16 py-20">
        {/* Hero date */}
        <FadeIn className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-crimson-600 text-xs tracking-widest">06</span>
            <div className="h-px w-8 bg-crimson-800/50" />
            <span className="text-parchment-600 text-xs tracking-widest uppercase">Bước ngoặt</span>
          </div>
          <div className="font-display font-black leading-none select-none text-crimson-800/20" style={{ fontSize:'clamp(44px,8vw,84px)' }}>
            09/03/1945
          </div>
          <h2 className="font-bold text-3xl lg:text-4xl text-parchment-100 mt-1 leading-tight">Nhật đảo chính Pháp</h2>
          <p className="text-parchment-500 mt-3 max-w-xl leading-relaxed">Trong một đêm, toàn bộ cục diện Đông Dương thay đổi hoàn toàn. Đây là bước ngoặt quyết định tạo điều kiện khách quan cho tổng khởi nghĩa.</p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Cascade */}
          <div className="flex flex-col items-start">
            {marchSteps.map((s, i) => (
              <div key={s.step} className="w-full">
                <FadeIn>
                  <div className={`border p-5 ${s.hi?'border-crimson-700/50 bg-crimson-950/20':'border-ink-600 bg-ink-800/30'}`}>
                    <div className={`font-mono text-xs tracking-widest mb-2 ${s.hi?'text-crimson-400':'text-gold-600'}`}>{s.step}</div>
                    <div className="text-parchment-100 text-base font-bold mb-2 leading-snug">{s.title}</div>
                    <p className="text-parchment-400 text-sm leading-relaxed mb-3">{s.desc}</p>
                    <div className="border-t border-ink-600/60 pt-2">
                      <span className="font-mono text-gold-700 text-xs">TÁC ĐỘNG: </span>
                      <span className="text-parchment-500 text-xs">{s.impact}</span>
                    </div>
                  </div>
                </FadeIn>
                {i < marchSteps.length-1 && <Arrow />}
              </div>
            ))}
          </div>

          {/* Photos + source */}
          <div className="space-y-5">
            <FadeIn><Img title="Đảo chính Nhật – Pháp đêm 9 rạng 10/3/1945" inst="Bảo tàng Lịch sử Quốc gia Việt Nam" url="https://baotanglichsu.vn/" aspect="4/3" /></FadeIn>
            <FadeIn><Img title="Bản chỉ thị 12/3/1945 – Tài liệu gốc" inst="Trung tâm Lưu trữ Quốc gia III" url="https://luutruco.gov.vn/" aspect="4/3" /></FadeIn>
          </div>
        </div>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 07: THỜI CƠ ────────────────────────────────────────────────────

function S07() {
  const [phase, setPhase] = useState<'closed'|'open'|'narrowing'>('closed');
  const ref = useRef<HTMLDivElement>(null);
  const srcs: SourceEntry[] = [
    { type:'document', title:'Sự kiện phát xít Nhật tuyên bố đầu hàng Đồng minh (14/8/1945)', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/14864/68-nam-su-kien-phat-xit-nhat-tuyen-bo-djau-hang-djong-minh-14-8-1945-14-8-2013.html' },
    { type:'document', title:'Đặc trưng của Cách mạng Tháng Tám', institution:'Cục Văn thư và Lưu trữ Nhà nước', url:'https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/dac-trung-cua-cach-mang-thang-tam.htm' },
    { type:'photo', title:'Tổng khởi nghĩa Cách mạng Tháng Tám năm 1945 tại Hà Nội', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html' },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setPhase('open'), 400);
        setTimeout(() => setPhase('narrowing'), 3500);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const wHeight = phase === 'open' ? '220px' : phase === 'narrowing' ? '70px' : '0px';
  const wBorder = phase === 'open' ? 'rgba(196,154,34,0.7)' : phase === 'narrowing' ? 'rgba(196,154,34,0.35)' : 'rgba(107,78,8,0.2)';
  const wBg = phase === 'open' ? 'rgba(26,17,0,0.5)' : 'transparent';

  return (
    <section id="thoico" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]">
      <div className="max-w-5xl mx-auto px-6 lg:px-16 py-20">
        <SH num="07" label="Thời cơ" title={'Thời cơ "Ngàn năm có một"'}
          subtitle="Tháng 8/1945. Một cửa sổ lịch sử mở ra — ngắn ngủi, không lặp lại." />

        {/* Window visual */}
        <div ref={ref} className="mb-14">
          <div className="grid grid-cols-7 gap-3 items-stretch min-h-[280px]">
            {/* Before */}
            <div className="col-span-2 border border-ink-600 bg-ink-800/30 p-5 flex flex-col justify-center">
              <div className="font-mono text-parchment-700 text-xs tracking-widest mb-3">TRƯỚC</div>
              <div className="space-y-3">
                {['Nhật thống trị Đông Dương','Chính quyền tập trung','Kháng chiến chưa thể toàn diện'].map(t => (
                  <div key={t} className="flex gap-2 items-start text-xs text-parchment-500">
                    <span className="text-crimson-700 flex-shrink-0">·</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Window */}
            <div className="col-span-3 flex flex-col items-center justify-center">
              <div className="font-mono text-gold-700 text-xs tracking-widest mb-3 text-center">CỬA SỔ THỜI CƠ</div>
              <div
                className="w-full border-2 overflow-hidden flex items-center justify-center transition-all"
                style={{ height: wHeight, borderColor: wBorder, background: wBg, boxShadow: phase==='open'?'0 0 50px rgba(196,154,34,0.08)':'none', transitionDuration:'1400ms', transitionTimingFunction:'ease-out' }}
              >
                <div className="text-center p-4 transition-opacity duration-700" style={{ opacity: phase==='open'?1:0 }}>
                  <div className="font-display font-bold text-gold-400 text-2xl mb-1">THỜI CƠ</div>
                  <div className="font-mono text-parchment-500 text-xs mb-2">15/8 – ~25/8/1945</div>
                  <div className="font-mono text-gold-600 text-xs">[ KHOẢNG TRỐNG QUYỀN LỰC ]</div>
                </div>
              </div>
              <div className="mt-2 font-mono text-xs text-center transition-colors duration-500"
                style={{ color: phase==='open'?'rgba(196,154,34,0.7)':phase==='narrowing'?'rgba(144,120,96,0.6)':'rgba(64,50,26,0.5)' }}>
                {phase==='open'?'[ MỞ RỘNG ]':phase==='narrowing'?'[ THU HẸP ]':'[ ĐANG MỞ ]'}
              </div>
            </div>

            {/* After */}
            <div className="col-span-2 border border-ink-600 bg-ink-800/30 p-5 flex flex-col justify-center">
              <div className="font-mono text-parchment-700 text-xs tracking-widest mb-3">SAU</div>
              <div className="space-y-3">
                {['Quân Đồng minh chuẩn bị tiến vào','Các thế lực mới xuất hiện','Thời cơ thu hẹp và đóng lại'].map(t => (
                  <div key={t} className="flex gap-2 items-start text-xs text-parchment-500">
                    <span className="text-crimson-700 flex-shrink-0">·</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cascade of factors */}
        <FadeIn className="mb-12">
          <div className="border border-gold-800/30 bg-gold-950/10 p-6 mb-6">
            <div className="font-mono text-gold-600 text-xs tracking-widest mb-5 text-center">CÁC YẾU TỐ TẠO RA THỜI CƠ</div>
            <div className="flex flex-col items-center max-w-sm mx-auto">
              {[
                { lab:'NHẬT ĐẦU HÀNG', sub:'8/1945 — Đồng minh thắng lợi ở Thái Bình Dương' },
                { lab:'CHÍNH QUYỀN HOANG MANG', sub:'Bù nhìn tê liệt, mất khả năng kiểm soát' },
                { lab:'KHOẢNG TRỐNG QUYỀN LỰC', sub:'Không ai kiểm soát — cơ hội mở ra' },
                { lab:'ĐỒNG MINH SẼ TIẾN VÀO', sub:'Thời cơ thu hẹp — phải hành động ngay' },
              ].map((item, i) => (
                <div key={item.lab} className="w-full">
                  <div className={`border p-3 text-center ${i===2?'border-gold-600/50 bg-gold-950/20':'border-ink-600 bg-ink-800/30'}`}>
                    <div className={`font-mono text-xs tracking-widest mb-1 ${i===2?'text-gold-400':'text-parchment-500'}`}>{item.lab}</div>
                    <div className="text-parchment-500 text-xs">{item.sub}</div>
                  </div>
                  {i<3 && <Arrow />}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Photos */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <FadeIn><Img title="Quần chúng Hà Nội xuống đường tháng 8/1945" inst="Bảo tàng Lịch sử Quốc gia Việt Nam" url="https://baotanglichsu.vn/" aspect="4/3" /></FadeIn>
          <FadeIn><Img title="Đội quân khởi nghĩa tiến vào Hà Nội, 19/8/1945" inst="Thông tấn xã Việt Nam (TTXVN)" url="https://www.vietnamplus.vn/" aspect="4/3" /></FadeIn>
        </div>

        {/* Key message */}
        <FadeIn>
          <div className="border-2 border-gold-700/35 bg-gold-950/10 p-8 text-center max-w-3xl mx-auto">
            <p className="text-parchment-200 text-xl leading-relaxed font-medium mb-3">"Thời cơ xuất hiện trong thời gian ngắn.</p>
            <p className="text-gold-300 text-xl leading-relaxed font-bold">Nhưng <em>khả năng chớp thời cơ</em> được tạo nên từ nhiều năm chuẩn bị kiên trì."</p>
          </div>
        </FadeIn>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 08: QUYẾT ĐỊNH ─────────────────────────────────────────────────

function S08() {
  const [exp, setExp] = useState<number|null>(0);
  const srcs: SourceEntry[] = [
    { type:'document', title:'Đặc trưng của Cách mạng Tháng Tám – Quân lệnh số 1 và tiến trình tổng khởi nghĩa', institution:'Cục Văn thư và Lưu trữ Nhà nước', url:'https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/dac-trung-cua-cach-mang-thang-tam.htm', date:'13/08/1945' },
    { type:'document', title:'Không khí sục sôi những ngày Cách mạng Tháng Tám ở Việt Bắc', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3096/69455/khong-khi-suc-soi-nhung-ngay-cach-mang-thang-tam-nam-1945-o-cac-tinh-viet-bac-cu.html', date:'13–16/08/1945' },
    { type:'photo', title:'Tổng khởi nghĩa Cách mạng Tháng Tám năm 1945 tại Hà Nội', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html', date:'19/08/1945' },
    { type:'document', title:'Ngày 2/9/1945 – mốc son chói lọi của dân tộc', institution:'Cổng thông tin Hồ Chí Minh', url:'https://hochiminh.vn/tin-tuc/ngay-2-9-1945-moc-son-choi-loi-cua-mot-dan-toc-anh-hung-9459', date:'02/09/1945' },
  ];

  return (
    <section id="quyetdinh" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]" style={{ background:'rgba(5,3,1,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-16 py-20">
        <SH num="08" label="Những quyết định" title="Những Quyết định tạo nên Thắng lợi"
          subtitle="Mỗi quyết định không chỉ phản ánh điều đã xảy ra — mà còn giải thích vì sao và tạo điều kiện gì cho bước tiếp theo." />

        <div className="relative">
          {/* Spine */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gold-900/30" />

          <div className="space-y-4">
            {decisions.map((d, i) => (
              <FadeIn key={i} className="relative pl-16">
                <div className={`absolute left-[18px] top-6 w-4 h-4 border-2 transition-colors duration-200 ${exp===i?'bg-gold-600 border-gold-500':'bg-ink-900 border-gold-900/50'}`} />

                <div className={`border transition-all duration-200 ${exp===i?'border-gold-700/50 bg-gold-950/10':'border-ink-600 bg-ink-800/20 hover:border-ink-500'}`}>
                  <button onClick={()=>setExp(exp===i?null:i)} className="w-full p-5 text-left">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-gold-600 text-xs tracking-widest mb-1">{d.date}</div>
                        <div className="text-parchment-100 text-base font-bold leading-snug">{d.title}</div>
                        <div className="text-parchment-500 text-sm mt-1 leading-relaxed">{d.decision}</div>
                      </div>
                      <span className="text-parchment-600 text-xs flex-shrink-0 mt-1">{exp===i?'▲':'▼'}</span>
                    </div>
                  </button>

                  {exp===i && (
                    <div className="border-t border-ink-600 p-5 grid lg:grid-cols-3 gap-6">
                      <div>
                        <div className="font-mono text-crimson-400 text-xs tracking-widest mb-3">VÌ SAO QUYẾT ĐỊNH NÀY?</div>
                        <p className="text-parchment-400 text-sm leading-relaxed">{d.why}</p>
                      </div>
                      <div>
                        <div className="font-mono text-gold-500 text-xs tracking-widest mb-3">KẾT QUẢ</div>
                        <p className="text-parchment-400 text-sm leading-relaxed mb-3">{d.result}</p>
                        {d.next && (
                          <div className="text-xs text-parchment-600">
                            → Tạo điều kiện cho: <span className="text-parchment-300 font-semibold">{d.next}</span>
                          </div>
                        )}
                      </div>
                      <Img title={d.photoTitle} inst={d.photoInst} url={d.photoUrl} aspect="4/3" />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-10 pl-16">
        </div>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 09: BÀI HỌC ────────────────────────────────────────────────────

function S09() {
  const srcs: SourceEntry[] = [
    { type:'document', title:'Lịch sử và kết quả một cuộc đua – chuẩn bị và chớp thời cơ Cách mạng Tháng Tám', institution:'Bảo tàng Lịch sử Quốc gia', url:'https://baotanglichsu.vn/vi/Articles/3097/16809/lich-su-va-ket-qua-mot-cuoc-djua.html' },
    { type:'document', title:'Cách mạng Tháng Tám – Một trang sử vinh quang', institution:'Cục Văn thư và Lưu trữ Nhà nước', url:'https://archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/cach-mang-thang-tam-mot-trang-su-vinh-quang.htm' },
    { type:'interpretation', title:'Bốn bài học: phân tích, tổ chức, chuẩn bị và quyết định', institution:'Nhóm biên soạn', notes:'Khái quát từ chuỗi sự kiện và tài liệu đã dẫn ở các phần 01–08.' },
  ];
  return (
    <section id="baihoc" className="min-h-screen border-t border-ink-700/40 lg:pl-[70px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-20">
        <SH num="09" label="Bài học rút ra" title="Bài học Rút ra"
          subtitle="Không phải kết luận chung chung — đây là những bài học có thể kiểm chứng qua từng sự kiện trong câu chuyện trên." />

        {/* 4 Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-20">
          {lessons.map(l => (
            <FadeIn key={l.num}>
              <div className="border border-ink-600 bg-ink-800/20 p-8 relative overflow-hidden group hover:border-gold-800/50 transition-colors duration-300 min-h-[200px]">
                <div className="absolute top-3 right-4 font-display font-black text-8xl text-ink-700 leading-none select-none group-hover:text-ink-600 transition-colors duration-300">{l.num}</div>
                <div className="relative">
                  <div className="font-mono text-gold-700 text-xs tracking-widest mb-4">{l.keyword}</div>
                  <h3 className="text-parchment-100 text-xl font-bold mb-4 leading-tight">{l.title}</h3>
                  <p className="text-parchment-400 text-sm leading-relaxed">{l.content}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Equation */}
        <FadeIn>
          <div className="border border-gold-800/30 bg-gold-950/10 p-8 mb-14">
            <div className="font-mono text-gold-600 text-xs tracking-widest mb-6 text-center">PHƯƠNG TRÌNH LỊCH SỬ</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['BỐI CẢNH','+','VẤN ĐỀ','+','CHUYỂN HƯỚNG','+','XÂY DỰNG LỰC LƯỢNG','+','TÍCH LŨY','+','THỜI CƠ','+','QUYẾT ĐỊNH'].map((item, i) => (
                <span key={i} className={item==='+'?'text-gold-800 text-lg font-bold':'font-mono text-xs text-parchment-500 border border-ink-600 px-2 py-1 bg-ink-800/50'}>
                  {item}
                </span>
              ))}
              <span className="text-gold-500 text-xl font-display font-bold mx-2">=</span>
              <span className="font-bold text-parchment-100 text-sm border border-crimson-700/50 bg-crimson-950/20 px-5 py-2">
                CÁCH MẠNG THÁNG TÁM 1945
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Final */}
        <FadeIn className="max-w-3xl mx-auto">
          <Img title="Quảng trường Ba Đình – Ngày Độc lập 2/9/1945" inst="Thông tấn xã Việt Nam (TTXVN)" url="https://www.vietnamplus.vn/" aspect="16/9" className="mb-10" />
          <div className="border-t border-b border-gold-800/30 py-8 text-center">
            <p className="text-parchment-300 text-xl leading-relaxed font-medium mb-2">"Thời cơ là điều kiện khách quan.</p>
            <p className="text-gold-300 text-xl leading-relaxed font-bold">Khả năng chớp thời cơ là kết quả của quá trình chuẩn bị và quyết định chiến lược."</p>
          </div>
        </FadeIn>
        <Sources entries={srcs} />
      </div>
    </section>
  );
}

// ─── SECTION 10: TỔNG KẾT ───────────────────────────────────────────────────

function S10() {
  return (
    <section id="tongket" className="min-h-screen border-t border-gold-800/40 bg-[#d8c7a8] lg:pl-[70px]">
      <div className="min-h-screen flex items-center justify-center px-3 py-5 sm:px-6 lg:px-10">
        <figure className="w-full max-w-[1257px] overflow-hidden border border-[#bda87c] bg-[#f6efe2] shadow-[0_22px_70px_rgba(55,31,16,0.28)]">
          <img
            src="/final-summary-slide.png"
            alt="Trang tổng kết: Từ chuyển hướng đến chớp thời cơ, giai đoạn 1939–1945"
            className="block h-auto w-full"
          />
        </figure>
      </div>
    </section>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const ids = ['hero', ...NAV.map(s=>s.id)];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setActive(id); }, { threshold: 0.25 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o=>o?.disconnect());
  }, []);

  return (
    <div className="bg-ink-900 text-parchment-200 min-h-screen">
      <SideNav active={active} />
      <main>
        <Hero />
        <S01 />
        <S02 />
        <S03 />
        <S04 />
        <S05 />
        <S06 />
        <S07 />
        <S08 />
        <S09 />
        <S10 />
      </main>
    </div>
  );
}
