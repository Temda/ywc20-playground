"use server"

export async function searchApplicant(interviewRef: string) {
  try {
    const response = await fetch('https://api.ywc20.ywc.in.th/homework/candidates', {
      headers: {
        'x-reference-id': interviewRef,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    

    if (interviewRef === "PG09") {
      return {
        name: "Chaiyapon Sowanna",
        status: "passed",
        major: "Programming",
        interviewDate: "11 พฤษภาคม 2568 เวลา 09:30 น.",
        interviewLocation: "Cleverse ชั้น 13 อาคารรุ่งโรจน์ธนกุล ถนนรัชดาภิเษก เขตห้วยขวาง กรุงเทพฯ",
        additionalInfo: "กรุณาเตรียมบัตรประชาชนและเอกสารยืนยันการสมัครมาในวันสัมภาษณ์",
        resumeUrl: "https://example.com/resume/12345",
        portfolioUrl: "https://example.com/portfolio/12345",
        contact: {
          facebook: "https://www.facebook.com/chaiyapol.wongsuwan.1/",
          email: "tenda2526@gmail.com",
          github: "https://github.com/Temda",
          linkedin: "https://www.linkedin.com/in/chaiyapol/",
        },
      }
    }
    return null;
  } catch (error) {
    console.error("Error searching for applicant:", error)
    throw new Error("เกิดข้อผิดพลาดในการค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง")
  }
}
