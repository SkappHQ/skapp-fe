export default function Page({ userInput }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />; // ❌ Vulnerable to XSS
}
